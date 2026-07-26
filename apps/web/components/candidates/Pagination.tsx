/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  totalPages: number;
  currentPage: number;
};

export default function Pagination({ totalPages, currentPage }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handleNavigate = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push(createPageUrl(page));
    }
  };

  return (
    <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-6">
      <div className="text-sm text-slate-400">
        Page <span className="font-semibold text-white">{currentPage}</span> of{" "}
        <span className="font-semibold text-white">{totalPages}</span>
      </div>

      <nav aria-label="Pagination" className="flex items-center gap-2">
        <button
          onClick={() => handleNavigate(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none"
        >
          Previous
        </button>

        <button
          onClick={() => handleNavigate(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none"
        >
          Next
        </button>
      </nav>
    </div>
  );
}
