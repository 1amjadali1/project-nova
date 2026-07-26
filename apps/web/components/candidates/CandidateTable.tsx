 
import StatusBadge from "./StatusBadge";
import ActionButtons from "./ActionButtons";

type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  organizationId: string;
  organization: {
    id: string;
    name: string;
  };
  verifications?: any[]; // The included verifications array
  updatedAt?: Date;
};

type Props = {
  candidates: Candidate[];
  organizations: { id: string; name: string }[];
};

export default function CandidateTable({ candidates, organizations }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-sm text-slate-300">
            <tr>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Candidate</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Organization / Client</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Active Request</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Progress</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Risk Score</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Status</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 font-medium">Last Updated</th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="mb-4 h-12 w-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-lg font-medium text-slate-300">No matching candidates found</p>
                    <p className="mt-1">Try adjusting your search or filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              candidates.map((candidate) => {
                const activeRequest = candidate.verifications?.[0];

                return (
                  <tr key={candidate.id} className="border-t border-slate-800 transition hover:bg-slate-800/40">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="font-medium text-white">{candidate.firstName} {candidate.lastName}</div>
                      <div className="text-xs text-slate-500 mt-1">ID: {candidate.id.split('-').pop()}</div>
                    </td>
                    
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-slate-300">{candidate.organization.name}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Client: {activeRequest?.client?.name || "None"}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      {activeRequest ? (
                        <div>
                          <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-cyan-400 border border-slate-700">
                            {activeRequest.package?.name || "Custom"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs">No active requests</span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        <span className="text-xs text-slate-400">0%</span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-slate-400 text-xs font-medium">
                      Pending
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusBadge active={candidate.isActive} />
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-slate-400">
                      {candidate.updatedAt ? new Date(candidate.updatedAt).toLocaleDateString() : "-"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <ActionButtons candidate={candidate as any} organizations={organizations} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
