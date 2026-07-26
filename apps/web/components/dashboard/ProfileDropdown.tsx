"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User as UserIcon, Shield, Clock, LogOut, Key, Settings, Activity } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

interface ProfileDropdownProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-full bg-slate-900 border border-slate-700 py-1.5 pl-2 pr-4 transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600 text-sm font-bold text-white">
          {initials}
        </div>
        <div className="text-left hidden md:block">
          <p className="text-sm font-medium text-white leading-none">{user.firstName} {user.lastName}</p>
          <p className="text-xs text-slate-400 mt-1 leading-none">{user.role}</p>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-slate-700 bg-slate-900 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden">
          
          <div className="border-b border-slate-800 px-4 py-3">
            <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>

          <div className="py-2">
            <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => setIsOpen(false)}>
              <UserIcon className="h-4 w-4 text-slate-400" />
              My Profile
            </Link>
            <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => setIsOpen(false)}>
              <Settings className="h-4 w-4 text-slate-400" />
              My Account
            </Link>
            <Link href="/profile/security" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => setIsOpen(false)}>
              <Shield className="h-4 w-4 text-slate-400" />
              Security
            </Link>
            <Link href="/profile/sessions" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => setIsOpen(false)}>
              <Clock className="h-4 w-4 text-slate-400" />
              Sessions
            </Link>
            <Link href="/profile/activity" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => setIsOpen(false)}>
              <Activity className="h-4 w-4 text-slate-400" />
              Activity Log
            </Link>
          </div>

          <div className="border-t border-slate-800 py-2">
            <Link href="/profile/security" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => setIsOpen(false)}>
              <Key className="h-4 w-4 text-slate-400" />
              Change Password
            </Link>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-500 cursor-not-allowed" disabled title="Coming Soon">
              <Shield className="h-4 w-4 text-slate-600" />
              Two Factor Auth (Coming Soon)
            </button>
          </div>

          <div className="border-t border-slate-800 py-2">
            <button 
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
              onClick={async () => {
                await logoutAction();
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
