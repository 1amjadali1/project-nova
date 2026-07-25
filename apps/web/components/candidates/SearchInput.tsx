"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(defaultSearch);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      // Reset page to 1 on new search
      params.delete("page");
      
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, pathname, router, searchParams]);

  return (
    <div className="w-full max-w-md">
      <label htmlFor="search-candidates" className="sr-only">
        Search candidates
      </label>
      <input
        id="search-candidates"
        type="text"
        placeholder="Search candidates by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search candidates"
        className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
      />
    </div>
  );
}
