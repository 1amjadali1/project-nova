"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Download, AlertCircle } from "lucide-react";
import { getDocumentDownloadUrl } from "@/app/actions/document";
import Image from "next/image";

interface DocumentPreviewProps {
  documentId: string;
  mimeType: string;
  fileName: string;
  onClose: () => void;
}

export default function DocumentPreview({ documentId, mimeType, fileName, onClose }: DocumentPreviewProps) {
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

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950/90 backdrop-blur-sm">
      {/* Top Bar */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
        <h3 className="font-semibold text-white truncate max-w-[70%]">{fileName}</h3>
        <div className="flex items-center gap-4">
          {url && (
            <a 
              href={url} 
              download={fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 transition"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          )}
          <button 
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 overflow-hidden p-6 flex items-center justify-center">
        {isLoading && (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-cyan-500" />
            <p>Decrypting and loading document...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center text-red-400">
            <AlertCircle className="mb-4 h-12 w-12" />
            <p className="text-lg font-medium">Failed to load preview</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {url && !isLoading && !error && (
          <div className="h-full w-full max-w-5xl rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
            {isPdf ? (
              <iframe 
                src={`${url}#toolbar=0`} 
                className="h-full w-full border-none"
                title={fileName}
              />
            ) : isImage ? (
              <div className="relative h-full w-full flex items-center justify-center overflow-hidden p-4">
                <Image 
                  src={url} 
                  alt={fileName} 
                  fill
                  unoptimized
                  className="object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-slate-400">
                <FileIcon className="mb-4 h-16 w-16 opacity-50" />
                <p>Preview not available for this file type.</p>
                <a 
                  href={url} 
                  download={fileName}
                  className="mt-4 text-cyan-400 hover:underline"
                >
                  Download to view
                </a>
              </div>
            )}
          </div>
        )}
      </div>
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
