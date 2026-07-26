import { FileText, Image as ImageIcon, Trash2, Eye, Download } from "lucide-react";
import DocumentStatusBadge, { DocumentStatus } from "./DocumentStatusBadge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export interface DocumentInfo {
  id: string;
  fileName: string;
  originalFileName: string;
  documentType: string;
  mimeType: string;
  fileSize: number;
  status: string;
  createdAt: Date;
  candidateId: string;
}

interface DocumentCardProps {
  document: DocumentInfo;
  onPreview?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function DocumentCard({ document, onPreview, onDelete }: DocumentCardProps) {
  const isImage = document.mimeType.startsWith("image/");
  const Icon = isImage ? ImageIcon : FileText;

  const formattedSize = (document.fileSize / 1024 / 1024).toFixed(2) + " MB";
  const timeAgo = formatDistanceToNow(new Date(document.createdAt), { addSuffix: true });

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-cyan-400 group-hover:bg-cyan-500/10">
          <Icon className="h-6 w-6" />
        </div>
        <DocumentStatusBadge status={document.status as DocumentStatus} />
      </div>

      <div className="mt-5">
        <Link href={`/documents/${document.id}`} className="hover:underline">
          <h4 className="font-semibold text-white truncate" title={document.documentType}>
            {document.documentType}
          </h4>
        </Link>
        <p className="mt-1 text-xs text-slate-400 truncate" title={document.originalFileName}>
          {document.originalFileName}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-500">
        <span>{formattedSize}</span>
        <span>{timeAgo}</span>
      </div>

      {/* Overlay Actions */}
      <div className="absolute inset-0 flex items-center justify-center gap-3 bg-slate-950/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
        <Link 
          href={`/documents/${document.id}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-700"
          title="View Details"
        >
          <Eye className="h-5 w-5" />
        </Link>
        
        {onPreview && (
          <button 
            onClick={() => onPreview(document.id)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-white hover:bg-cyan-500"
            title="Preview"
          >
            <Download className="h-5 w-5" />
          </button>
        )}
        
        {onDelete && (
          <button 
            onClick={() => onDelete(document.id)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white"
            title="Delete"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
