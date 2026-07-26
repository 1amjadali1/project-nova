"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle, Download } from "lucide-react";
import { getDocumentDownloadUrl } from "@/app/actions/document";
import Image from "next/image";

interface DocumentViewerProps {
  documentId: string;
  mimeType: string;
  fileName: string;
}

export default function DocumentViewer({ documentId, mimeType, fileName }: DocumentViewerProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isPdf = mimeType === "application/pdf";
  const isImage = mimeType.startsWith("image/");

  useEffect(() => {
    async function fetchUrl() {
      try {
        const secureUrl = await getDocumentDownloadUrl(documentId);
        setUrl(secureUrl);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load document preview");
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchUrl();
  }, [documentId]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-cyan-500" />
        <p>Decrypting and loading document...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center text-red-400">
        <AlertCircle className="mb-4 h-12 w-12" />
        <p className="text-lg font-medium">Failed to load preview</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  if (!url) return null;

  if (isPdf) {
    return (
      <iframe 
        src={`${url}#toolbar=0`} 
        className="h-full w-full rounded-xl border-none bg-white"
        title={fileName}
      />
    );
  }

  if (isImage) {
    return (
      <div className="relative flex h-full w-full items-center justify-center rounded-xl bg-slate-900 overflow-hidden">
        <Image 
          src={url} 
          alt={fileName} 
          fill
          unoptimized
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
      <FileIcon className="mb-4 h-16 w-16 opacity-50" />
      <p>Preview not available for this file type.</p>
      <a 
        href={url} 
        download={fileName}
        className="mt-4 flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 transition"
      >
        <Download className="h-4 w-4" />
        Download to view
      </a>
    </div>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}
