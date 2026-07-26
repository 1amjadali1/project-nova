"use server";

import { prisma } from "@/lib/prisma";
import { getEnterpriseSession } from "@/lib/auth/session";
import { VerificationPriority, WorkflowStage } from "@prisma/client";

async function getAuthContext() {
  const sessionData = await getEnterpriseSession();
  if (!sessionData?.user) throw new Error("Unauthorized");
  
  const profile = await prisma.employeeProfile.findUnique({
    where: { userId: sessionData.user.id },
    include: { EmployeeRoleAssignment: { include: { Role: true } } }
  });

  if (!profile) throw new Error("Employee profile not found");

  const myLevel = Math.max(...(profile.EmployeeRoleAssignment.map(r => r.Role.hierarchyLevel) || [0]));
  const primaryRole = profile.EmployeeRoleAssignment[0]?.Role.name || "Unknown";
  
  return { userId: sessionData.user.id, profile, level: myLevel, roleName: primaryRole };
}

export async function addTimelineEvent(requestId: string, action: string, comment: string | null = null) {
  const ctx = await getAuthContext();
  await prisma.timelineEvent.create({
    data: {
      verificationRequestId: requestId,
      userId: ctx.userId,
      userRole: ctx.roleName,
      action,
      comment
    }
  });
}

export async function assignCaseAction(requestId: string, targetAssigneeProfileId: string) {
  const ctx = await getAuthContext();

  // Validate Target Assignee
  const target = await prisma.employeeProfile.findUnique({ where: { id: targetAssigneeProfileId } });
  if (!target) throw new Error("Assignee not found");

  // Restrictions:
  // Managers (>=30) can assign to anyone.
  // TLs (20) can only assign to members in their team.
  if (ctx.level < 30) {
    if (ctx.level === 20) {
      if (ctx.profile.teamId && ctx.profile.teamId !== target.teamId) {
        throw new Error("Team Leaders can only assign cases within their own team.");
      }
      if (!ctx.profile.teamId) {
        throw new Error("You are not assigned to a team.");
      }
    } else {
      throw new Error("You do not have permission to assign cases.");
    }
  }

  await prisma.verificationRequest.update({
    where: { id: requestId },
    data: {
      ownerId: target.id,
      assignedById: ctx.profile.id,
      assignedDate: new Date(),
      lastReassigned: new Date(),
      teamId: target.teamId,
      departmentId: target.departmentId,
      currentStage: "AGENT_PROCESSING"
    }
  });

  await addTimelineEvent(requestId, "ASSIGNED", `Assigned to ${target.employeeId || 'User'}`);
}

export async function escalateCaseAction(requestId: string) {
  const ctx = await getAuthContext();
  const req = await prisma.verificationRequest.findUnique({ where: { id: requestId } });
  if (!req) throw new Error("Request not found");

  let nextStage: WorkflowStage = req.currentStage;
  if (req.currentStage === "AGENT_PROCESSING") nextStage = "QA_REVIEW";
  else if (req.currentStage === "QA_REVIEW") nextStage = "TL_REVIEW";
  else if (req.currentStage === "TL_REVIEW") nextStage = "MANAGER_REVIEW";
  else throw new Error("Cannot escalate from current stage");

  await prisma.verificationRequest.update({
    where: { id: requestId },
    data: { currentStage: nextStage }
  });

  await addTimelineEvent(requestId, "ESCALATED", `Escalated from ${req.currentStage} to ${nextStage}`);
}

export async function returnCaseAction(requestId: string, reason: string) {
  const ctx = await getAuthContext();
  const req = await prisma.verificationRequest.findUnique({ where: { id: requestId } });
  if (!req) throw new Error("Request not found");

  if (!reason || reason.trim() === "") throw new Error("Reason is mandatory for returning a case");

  let prevStage: WorkflowStage = req.currentStage;
  if (req.currentStage === "QA_REVIEW") prevStage = "AGENT_PROCESSING";
  else if (req.currentStage === "TL_REVIEW") prevStage = "QA_REVIEW";
  else if (req.currentStage === "MANAGER_REVIEW") prevStage = "TL_REVIEW";
  else throw new Error("Cannot return from current stage");

  await prisma.verificationRequest.update({
    where: { id: requestId },
    data: { currentStage: prevStage }
  });

  await addTimelineEvent(requestId, "RETURNED", `Returned to ${prevStage}. Reason: ${reason}`);
}

export async function approveCaseAction(requestId: string) {
  const ctx = await getAuthContext();
  const req = await prisma.verificationRequest.findUnique({ where: { id: requestId } });
  if (!req) throw new Error("Request not found");

  let nextStage: WorkflowStage = req.currentStage;
  let newStatus = req.status;

  if (req.currentStage === "AGENT_PROCESSING") nextStage = "QA_REVIEW";
  else if (req.currentStage === "QA_REVIEW") nextStage = "TL_REVIEW";
  else if (req.currentStage === "TL_REVIEW") nextStage = "MANAGER_REVIEW";
  else if (req.currentStage === "MANAGER_REVIEW") {
    nextStage = "COMPLETED";
    newStatus = "VERIFIED";
  }

  await prisma.verificationRequest.update({
    where: { id: requestId },
    data: { 
      currentStage: nextStage,
      status: newStatus 
    }
  });

  await addTimelineEvent(requestId, "APPROVED", `Approved at ${req.currentStage} stage`);
}

export async function closeCaseAction(requestId: string, status: "VERIFIED" | "REJECTED" | "CLOSED") {
  const ctx = await getAuthContext();
  if (ctx.level < 30) throw new Error("Only Managers and above can close cases.");

  await prisma.verificationRequest.update({
    where: { id: requestId },
    data: { 
      currentStage: "CLOSED",
      status: status
    }
  });

  await addTimelineEvent(requestId, "CLOSED", `Case closed with status: ${status}`);
}

export async function reopenCaseAction(requestId: string, reason: string) {
  const ctx = await getAuthContext();
  if (ctx.level < 30) throw new Error("Only Managers and above can reopen cases.");
  
  if (!reason || reason.trim() === "") throw new Error("Reason is mandatory for reopening a case");

  await prisma.verificationRequest.update({
    where: { id: requestId },
    data: { 
      currentStage: "MANAGER_REVIEW",
      status: "IN_PROGRESS"
    }
  });

  await addTimelineEvent(requestId, "REOPENED", `Case reopened by Manager. Reason: ${reason}`);
}

export async function updatePriorityAction(requestId: string, priority: VerificationPriority) {
  const ctx = await getAuthContext();
  if (ctx.level < 20) throw new Error("Insufficient permissions to change priority.");

  await prisma.verificationRequest.update({
    where: { id: requestId },
    data: { priority }
  });

  await addTimelineEvent(requestId, "PRIORITY_CHANGED", `Priority updated to ${priority}`);
}
