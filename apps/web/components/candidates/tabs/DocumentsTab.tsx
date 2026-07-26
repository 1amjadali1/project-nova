/* eslint-disable @typescript-eslint/no-explicit-any */
import DocumentPreviewWrapper from "@/app/(dashboard)/documents/DocumentPreviewWrapper";

export default function DocumentsTab({ candidate }: { candidate: any }) {
  // We can group documents by Verification Check here, or display all.
  const docs = candidate.documents || [];

  if (docs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 py-16">
        <p className="text-lg font-medium text-slate-300">No documents uploaded.</p>
      </div>
    );
  }

  // To group by check, we need to map over docs
  const groupedDocs = docs.reduce((acc: Record<string, any[]>, doc: any) => {
    // If the document is attached to a specific check, use it, else "Unassigned"
    const checkId = doc.verificationCheckId || "Unassigned";
    if (!acc[checkId]) acc[checkId] = [];
    acc[checkId].push(doc);
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      {Object.entries(groupedDocs).map(([checkId, groupDocs]: [string, any]) => (
        <div key={checkId} className="space-y-4">
          <h3 className="text-lg font-medium text-white border-b border-slate-800 pb-2">
            {checkId === "Unassigned" ? "Global Documents" : `Module specific documents`}
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <DocumentPreviewWrapper documents={groupDocs} />
          </div>
        </div>
      ))}
    </div>
  );
}
