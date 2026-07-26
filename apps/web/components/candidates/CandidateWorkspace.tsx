/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import OverviewTab from "./tabs/OverviewTab";
import VerificationRequestsTab from "./tabs/VerificationRequestsTab";
import VerificationChecksTab from "./tabs/VerificationChecksTab";
import DocumentsTab from "./tabs/DocumentsTab";
import TimelineTab from "./tabs/TimelineTab";
import AIIntelligenceTab from "./tabs/AIIntelligenceTab";
import AuditLogsTab from "./tabs/AuditLogsTab";

type CandidateWorkspaceProps = {
  candidate: any; 
  timelineEvents: any[];
  auditLogs: any[];
};

export default function CandidateWorkspace({ candidate, timelineEvents, auditLogs }: CandidateWorkspaceProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "requests", label: "Verification Requests" },
    { id: "checks", label: "Verification Checks" },
    { id: "documents", label: "Documents" },
    { id: "timeline", label: "Timeline" },
    { id: "ai", label: "AI Intelligence" },
    { id: "audit", label: "Audit Logs" },
  ];

  return (
    <div className="flex flex-col space-y-6">
      <div className="border-b border-slate-800">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors
                ${
                  activeTab === tab.id
                    ? "border-cyan-500 text-cyan-400"
                    : "border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-300"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === "overview" && <OverviewTab candidate={candidate} />}
        {activeTab === "requests" && <VerificationRequestsTab candidate={candidate} />}
        {activeTab === "checks" && <VerificationChecksTab candidate={candidate} />}
        {activeTab === "documents" && <DocumentsTab candidate={candidate} />}
        {activeTab === "timeline" && <TimelineTab timelineEvents={timelineEvents} />}
        {activeTab === "ai" && <AIIntelligenceTab candidate={candidate} />}
        {activeTab === "audit" && <AuditLogsTab auditLogs={auditLogs} />}
      </div>
    </div>
  );
}
