import StatusBadge from "./StatusBadge";
import ActionButtons from "./ActionButtons";

type Organization = {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
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
      <table className="w-full">

        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="px-6 py-4 text-left">Organization</th>
            <th className="px-6 py-4 text-left">Slug</th>
            <th className="px-6 py-4 text-left">Email</th>
            <th className="px-6 py-4 text-left">Phone</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>

          {organizations.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="py-10 text-center text-slate-400"
              >
                No organizations found.
              </td>
            </tr>
          ) : (

            organizations.map((org) => (

              <tr
                key={org.id}
                className="border-t border-slate-800 hover:bg-slate-800/40 transition"
              >

                <td className="px-6 py-4 font-medium">
                  {org.name}
                </td>

                <td className="px-6 py-4 text-slate-400">
                  {org.slug}
                </td>

                <td className="px-6 py-4">
                  {org.email ?? "-"}
                </td>

                <td className="px-6 py-4">
                  {org.phone ?? "-"}
                </td>

                <td className="px-6 py-4">
                  <StatusBadge active={org.isActive} />
                </td>

                <td className="px-6 py-4 text-center">
                  <ActionButtons id={org.id} />
                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>
    </div>
  );
}
