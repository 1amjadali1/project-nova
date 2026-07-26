"use client";

import { useState } from "react";
import EditVerificationModal from "./EditVerificationModal";
import DeleteVerificationModal from "./DeleteVerificationModal";
import Link from "next/link";

type Verification = {
  id: string;
  type: string;
  status: string;
  notes: string | null;
};

type Props = {
  verification: Verification;
};

export default function ActionButtons({ verification }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex justify-center gap-2">
        <Link
          href={`/verifications/${verification.id}`}
          className="rounded-lg bg-cyan-600/10 px-3 py-1.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-600/20"
        >
          Details
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
        <EditVerificationModal 
          verification={verification} 
          onClose={() => setIsEditOpen(false)} 
        />
      )}

      {isDeleteOpen && (
        <DeleteVerificationModal 
          verification={verification} 
          onClose={() => setIsDeleteOpen(false)} 
        />
      )}
    </>
  );
}
