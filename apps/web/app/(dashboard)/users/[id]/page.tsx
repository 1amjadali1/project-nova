import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/users/StatusBadge";

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      organization: true,
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">
            {user.firstName} {user.lastName}
          </h1>
          <p className="mt-2 text-slate-400">
            User Profile
          </p>
        </div>
        <Link
          href="/users"
          className="rounded-xl border border-slate-700 px-5 py-2.5 font-medium hover:bg-slate-800 transition"
        >
          Back to Users
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h2 className="mb-6 text-xl font-semibold text-white">Profile Information</h2>
        
        <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-sm font-medium text-slate-400">Status</dt>
            <dd className="mt-2">
              <StatusBadge isActive={user.isActive} />
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-slate-400">Email Address</dt>
            <dd className="mt-2 text-slate-200">
              <a href={`mailto:${user.email}`} className="text-cyan-400 hover:underline">
                {user.email}
              </a>
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-slate-400">Organization</dt>
            <dd className="mt-2 text-slate-200">
              <Link 
                href={`/organizations/${user.organizationId}`}
                className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                {user.organization.name}
              </Link>
            </dd>
          </div>
          
          <div className="sm:col-span-2 lg:col-span-3">
            <dt className="text-sm font-medium text-slate-400">Assigned Roles</dt>
            <dd className="mt-3 flex flex-wrap gap-2">
              {user.roles.length === 0 ? (
                <span className="text-slate-500 italic">No roles assigned</span>
              ) : (
                user.roles.map((ur) => (
                  <span 
                    key={ur.id}
                    className="inline-flex rounded-lg bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-400 ring-1 ring-inset ring-cyan-500/20"
                  >
                    {ur.role.name}
                  </span>
                ))
              )}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-slate-400">Account Created</dt>
            <dd className="mt-2 text-slate-200">
              {new Date(user.createdAt).toLocaleString()}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-slate-400">Last Updated</dt>
            <dd className="mt-2 text-slate-200">
              {new Date(user.updatedAt).toLocaleString()}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
