/* eslint-disable @typescript-eslint/no-explicit-any */
export default function OverviewTab({ candidate }: { candidate: any }) {
  return (
    <div className="space-y-6 text-slate-300">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm">
        <h3 className="text-lg font-medium text-white mb-4">Candidate Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <div className="text-sm font-medium text-slate-500">Email</div>
            <div className="mt-1">{candidate.email}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Phone</div>
            <div className="mt-1">{candidate.phone || "N/A"}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Date of Birth</div>
            <div className="mt-1">{candidate.dateOfBirth ? new Date(candidate.dateOfBirth).toLocaleDateString() : "N/A"}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Nationality</div>
            <div className="mt-1">{candidate.nationality || "N/A"}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Marital Status</div>
            <div className="mt-1">{candidate.maritalStatus || "N/A"}</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm">
        <h3 className="text-lg font-medium text-white mb-4">Masked Identifiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="text-sm font-medium text-slate-500">PAN</div>
            <div className="mt-1">{candidate.panNumber ? `********${candidate.panNumber.slice(-4)}` : "N/A"}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Aadhaar</div>
            <div className="mt-1">{candidate.aadhaarNumber ? `********${candidate.aadhaarNumber.slice(-4)}` : "N/A"}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Passport</div>
            <div className="mt-1">{candidate.passportNumber || "N/A"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
