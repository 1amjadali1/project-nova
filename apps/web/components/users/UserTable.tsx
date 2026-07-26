import StatusBadge from "./StatusBadge";
import ActionButtons from "./ActionButtons";
import Link from "next/link";

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
  createdAt: Date;
  organization: {
    name: string;
  };
  roles: {
    role: Role;
  }[];
};

type Props = {
  users: User[];
  roles: Role[];
};

export default function UserTable({ users, roles }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-sm text-slate-300">
            <tr>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Name</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Role</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Organization</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Status</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Created On</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-16 text-center text-slate-400"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="mb-4 h-12 w-12 text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <p className="text-lg font-medium text-slate-300">No matching users found</p>
                    <p className="mt-1">Try adjusting your search or filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-slate-800 transition hover:bg-slate-800/40"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link href={`/users/${user.id}`} className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline">
                      {user.firstName} {user.lastName}
                    </Link>
                    <div className="text-xs text-slate-400">
                      {user.email}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-300">
                    {user.roles.map((r) => r.role.name).join(", ") || "No Role"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-300">
                    {user.organization.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge isActive={user.isActive} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <ActionButtons user={user} roles={roles} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
