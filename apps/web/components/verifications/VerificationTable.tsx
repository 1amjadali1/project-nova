import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import ActionButtons from "./ActionButtons";

type Verification = {
  id: string;
  type: string;
  status: string;
  priority: string;
  notes: string | null;
  candidateId: string;
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    organization: {
      name: string;
    };
  };
  createdAt: Date;
};

type Props = {
  verifications: Verification[];
};

export default function VerificationTable({ verifications }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-sm text-slate-300">
            <tr>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Candidate</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Type</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Priority</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Status</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Requested On</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {verifications.length === 0 ? (
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <p className="text-lg font-medium text-slate-300">No matching verifications found</p>
                    <p className="mt-1">Try adjusting your search or filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              verifications.map((verification) => (
                <tr
                  key={verification.id}
                  className="border-t border-slate-800 transition hover:bg-slate-800/40"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="font-medium text-white">
                      {verification.candidate.firstName} {verification.candidate.lastName}
                    </div>
                    <div className="text-xs text-slate-400">
                      {verification.candidate.organization.name}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-300">
                    {verification.type.replace(/_/g, " ")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <PriorityBadge priority={verification.priority} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={verification.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-300">
                    {new Date(verification.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <ActionButtons verification={verification} />
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
