import StatusBadge from "./StatusBadge";
import ActionButtons from "./ActionButtons";

type Organization = {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  isActive: boolean;
};

type Props = {
  organizations: Organization[];
};

export default function OrganizationTable({
  organizations,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-sm text-slate-300">
            <tr>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Organization</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Slug</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Email</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Phone</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Status</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {organizations.length === 0 ? (
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
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-lg font-medium text-slate-300">No matching organizations found</p>
                    <p className="mt-1">Try adjusting your search or filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              organizations.map((org) => (
                <tr
                  key={org.id}
                  className="border-t border-slate-800 transition hover:bg-slate-800/40"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-white">
                    {org.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-400">
                    {org.slug}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-300">
                    {org.email ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-300">
                    {org.phone ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge active={org.isActive} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <ActionButtons organization={org} />
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
