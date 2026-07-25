"use client";

import { useState } from "react";
import EditOrganizationModal from "./EditOrganizationModal";
import DeleteOrganizationModal from "./DeleteOrganizationModal";

type Organization = {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  website: string | null;
};

type Props = {
  organization: Organization;
};

export default function ActionButtons({
  organization,
}: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setEditOpen(true)}
          className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium hover:bg-blue-500"
        >
          Edit
        </button>

        <button
          onClick={() => setDeleteOpen(true)}
          className="rounded-lg bg-red-600 px-3 py-1 text-sm font-medium hover:bg-red-500"
        >
          Delete
        </button>
      </div>

      <EditOrganizationModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        organization={organization}
      />

      <DeleteOrganizationModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        organization={organization}
      />
    </>
  );
}
