"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/auth/rbac";
import { uploadDocument, getSignedUrl } from "@/lib/storage/supabase";
import { revalidatePath } from "next/cache";

export async function uploadCandidateDocument(candidateId: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  // Validate candidate belongs to user's org
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
    select: { organizationId: true },
  });

  if (!candidate) throw new Error("Candidate not found");
  if (candidate.organizationId !== session.user.organizationId) {
    throw new Error("Unauthorized: Cross-tenant access denied");
  }

  const hasPerm = await hasPermission(session.user.id, "documents:write");
  if (!hasPerm) throw new Error("Forbidden: Missing documents:write permission");

  const file = formData.get("file") as File;
  const documentType = formData.get("documentType") as string;
  const notes = formData.get("notes") as string | undefined;

  if (!file || !documentType) throw new Error("File and document type are required");

  // Validation
  if (file.size > 25 * 1024 * 1024) throw new Error("File exceeds 25MB limit");
  const allowedMimeTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
  if (!allowedMimeTypes.includes(file.type)) throw new Error("Unsupported file type");

  const fileExtension = file.name.split(".").pop();
  const internalFileName = `${crypto.randomUUID()}.${fileExtension}`;
  const storagePath = `${session.user.organizationId}/${candidateId}/${internalFileName}`;

  // Upload to Supabase Storage
  const { path, error: uploadError } = await uploadDocument(file, storagePath);
  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  // Create DB Record
  const document = await prisma.document.create({
    data: {
      documentType,
      fileName: internalFileName,
      originalFileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      storagePath: path,
      notes,
      candidateId,
      organizationId: session.user.organizationId,
      uploadedById: session.user.id,
      status: "UPLOADED",
    },
  });

  revalidatePath(`/candidates/${candidateId}`);
  revalidatePath("/documents");

  return document;
}

export async function softDeleteDocument(documentId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) throw new Error("Document not found");
  if (document.organizationId !== session.user.organizationId) {
    throw new Error("Unauthorized: Cross-tenant access denied");
  }

  const hasPerm = await hasPermission(session.user.id, "documents:write");
  if (!hasPerm) throw new Error("Forbidden: Missing documents:write permission");

  await prisma.document.update({
    where: { id: documentId },
    data: { isDeleted: true },
  });

  // Optionally, you can trigger storage deletion if hard delete is required.
  // await deleteStorageDocument(document.storagePath);

  revalidatePath(`/candidates/${document.candidateId}`);
  revalidatePath("/documents");
}

export async function getDocumentDownloadUrl(documentId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document || document.isDeleted) throw new Error("Document not found");
  if (document.organizationId !== session.user.organizationId) {
    throw new Error("Unauthorized: Cross-tenant access denied");
  }

  const hasPerm = await hasPermission(session.user.id, "documents:read");
  if (!hasPerm) throw new Error("Forbidden: Missing documents:read permission");

  const { url, error } = await getSignedUrl(document.storagePath, 3600);
  if (error) throw new Error(`Failed to generate secure URL: ${error.message}`);

  return url;
}

export async function updateDocumentStatus(documentId: string, status: string, notes?: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document) throw new Error("Document not found");
  if (document.organizationId !== session.user.organizationId) {
    throw new Error("Unauthorized: Cross-tenant access denied");
  }

  const hasPerm = await hasPermission(session.user.id, "documents:write");
  if (!hasPerm) throw new Error("Forbidden: Missing documents:write permission");

  const updated = await prisma.document.update({
    where: { id: documentId },
    data: { 
      status,
      notes: notes !== undefined ? notes : document.notes,
      ...(status === "VERIFIED" ? { verifiedById: session.user.id } : {})
    },
  });

  revalidatePath(`/documents/${documentId}`);
  revalidatePath(`/candidates/${document.candidateId}`);
  
  return updated;
}
