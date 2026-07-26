import { prisma } from "@/lib/prisma";
import { 
  AssignmentStatus, 
  SLAStatus, 
  ApprovalStatus, 
  RequestType, 
  RequestStatus, 
  SystemAuditLog 
} from "@prisma/client";

/**
 * Enterprise Workflow Engine
 * Handles the complete lifecycle of a VerificationCheck through assignment, SLA tracking, and multi-tier QA/Manager approvals.
 */
export class WorkflowEngine {

  /**
   * Assign a VerificationCheck to an Agent and initialize SLA tracking.
   */
  static async assignTask(
    verificationCheckId: string, 
    assigneeId: string, 
    assignedById: string, 
    slaDays: number = 3
  ) {
    const slaDueDate = new Date();
    slaDueDate.setDate(slaDueDate.getDate() + slaDays);

    const assignment = await prisma.workAssignment.upsert({
      where: { verificationCheckId },
      create: {
        verificationCheckId,
        assigneeId,
        assignedById,
        status: AssignmentStatus.PENDING,
        slaStatus: SLAStatus.ON_TRACK,
        slaDueDate,
      },
      update: {
        assigneeId,
        assignedById,
        status: AssignmentStatus.PENDING,
        slaStatus: SLAStatus.ON_TRACK,
        slaDueDate,
      }
    });

    // Generate Notification
    const check = await prisma.verificationCheck.findUnique({ where: { id: verificationCheckId } });
    await this.notify(assigneeId, "New Assignment", `You have been assigned a new ${check?.category} check.`);

    // Audit Log
    await this.auditLog(assignedById, "ASSIGN_TASK", "VerificationCheck", verificationCheckId, {
      assigneeId,
      slaDays
    });

    return assignment;
  }

  /**
   * Agent submits their completed work for QA Approval
   */
  static async submitForQA(verificationCheckId: string, agentId: string) {
    // 1. Mark assignment as completed
    await prisma.workAssignment.update({
      where: { verificationCheckId },
      data: {
        status: AssignmentStatus.COMPLETED,
        completedAt: new Date()
      }
    });

    // 2. Mark verification check as IN_PROGRESS (awaiting QA)
    await prisma.verificationCheck.update({
      where: { id: verificationCheckId },
      data: {
        status: RequestStatus.IN_PROGRESS
      }
    });

    // 3. Create Approval Request for QA
    const approvalRequest = await prisma.approvalRequest.create({
      data: {
        verificationCheckId,
        requesterId: agentId,
        type: RequestType.APPROVAL,
        status: ApprovalStatus.PENDING,
      }
    });

    await this.auditLog(agentId, "SUBMIT_FOR_QA", "VerificationCheck", verificationCheckId, { approvalRequestId: approvalRequest.id });
    return approvalRequest;
  }

  /**
   * QA or Manager reviews the Approval Request
   */
  static async reviewTask(
    approvalRequestId: string, 
    reviewerId: string, 
    status: ApprovalStatus, 
    comments?: string
  ) {
    const request = await prisma.approvalRequest.update({
      where: { id: approvalRequestId },
      data: {
        reviewerId,
        status,
        comments
      },
      include: {
        verificationCheck: true
      }
    });

    // If APPROVED by Manager, we mark check as COMPLETED. (Simplified logic: if QA approves, goes to Manager, etc)
    if (status === ApprovalStatus.APPROVED) {
      await prisma.verificationCheck.update({
        where: { id: request.verificationCheckId },
        data: { status: RequestStatus.COMPLETED }
      });
      await this.notify(request.requesterId, "Task Approved", `Your work on ${request.verificationCheck.category} was approved.`);
    } else if (status === ApprovalStatus.REJECTED || status === ApprovalStatus.SENT_BACK) {
      // Re-open assignment for the agent
      await prisma.workAssignment.update({
        where: { verificationCheckId: request.verificationCheckId },
        data: { status: AssignmentStatus.IN_PROGRESS }
      });
      await this.notify(request.requesterId, "Task Returned", `Your work on ${request.verificationCheck.category} was returned: ${comments}`);
    }

    await this.auditLog(reviewerId, `REVIEW_${status}`, "ApprovalRequest", approvalRequestId, { comments });
    return request;
  }

  // --- Internal Utilities ---

  private static async notify(recipientId: string, title: string, message: string) {
    // We assume organizationId can be fetched from the employee profile, for now we will stub it or fetch it
    const profile = await prisma.employeeProfile.findUnique({
      where: { id: recipientId },
      include: { user: true }
    });
    
    if (profile) {
      await prisma.notificationEvent.create({
        data: {
          recipientId,
          title,
          message,
          organizationId: profile.user.organizationId
        }
      });
    }
  }

  private static async auditLog(userId: string, action: string, entityType: string, entityId: string, details: any) {
    const profile = await prisma.employeeProfile.findUnique({
      where: { id: userId },
      include: { user: true }
    });

    if (profile) {
      await prisma.systemAuditLog.create({
        data: {
          organizationId: profile.user.organizationId,
          userId: profile.user.id,
          action,
          entityType,
          entityId,
          details
        }
      });
    }
  }
}
