"use client";

import { useState } from "react";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";

type Role = {
  id: string;
  name: string;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  roles: { role: Role }[];
};

type Props = {
  user: User;
  roles: Role[];
};

export default function ActionButtons({ user, roles }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex justify-center gap-2">
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
        <EditUserModal 
          user={user} 
          roles={roles}
          onClose={() => setIsEditOpen(false)} 
        />
      )}

      {isDeleteOpen && (
        <DeleteUserModal 
          user={user} 
          onClose={() => setIsDeleteOpen(false)} 
        />
      )}
    </>
  );
}
