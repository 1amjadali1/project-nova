"use client";

import { stopImpersonationAction } from "@/app/actions/impersonate";
import { AlertTriangle, LogOut } from "lucide-react";

interface ImpersonationBannerProps {
  originalUserName: string;
  originalUserRole: string;
  impersonatedUserName: string;
  impersonatedUserRole: string;
}

export default function ImpersonationBanner({ 
  originalUserName, 
  originalUserRole, 
  impersonatedUserName, 
  impersonatedUserRole 
}: ImpersonationBannerProps) {
  return (
    <div className="bg-yellow-500 text-yellow-950 px-4 py-3 shadow-lg border-b border-yellow-600 flex flex-col md:flex-row items-center justify-between z-[100] relative">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-6 w-6 text-yellow-800" />
        <div>
          <p className="text-sm font-semibold">
            You are currently working as <span className="underline decoration-yellow-700">{impersonatedUserName}</span> ({impersonatedUserRole})
          </p>
          <p className="text-xs text-yellow-800">
            Original User: {originalUserName} ({originalUserRole})
          </p>
        </div>
      </div>
      <button 
        onClick={() => stopImpersonationAction()}
        className="mt-3 md:mt-0 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
      >
        <LogOut className="h-4 w-4" />
        Return To Original Account
      </button>
    </div>
  );
}
