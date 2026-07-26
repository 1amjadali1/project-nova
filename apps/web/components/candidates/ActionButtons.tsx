 
"use client";

import { useState } from "react";
import Link from "next/link";
import EditCandidateModal from "./EditCandidateModal";
import DeleteCandidateModal from "./DeleteCandidateModal";

type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  organizationId: string;
};

type Props = {
  candidate: Candidate;
  organizations: { id: string; name: string }[];
};

export default function ActionButtons({ candidate, organizations }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end gap-2">
        <Link
          href={`/candidates/${candidate.id}`}
          className="rounded-lg bg-cyan-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-cyan-500"
        >
          Workspace
        </Link>
        <button
          onClick={() => setIsEditOpen(true)}
          className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-cyan-400 transition hover:bg-slate-700"
        >
          Edit
        </button>

        <button
          onClick={() => setIsDeleteOpen(true)}
          className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-red-400 transition hover:bg-slate-700 hover:text-red-300"
        >
          Delete
        </button>
      </div>

      {isEditOpen && (
        <EditCandidateModal 
          candidate={candidate} 
          organizations={organizations}
          onClose={() => setIsEditOpen(false)} 
        />
      )}

      {isDeleteOpen && (
        <DeleteCandidateModal 
          candidate={candidate} 
          onClose={() => setIsDeleteOpen(false)} 
        />
      )}
    </>
  );
}
