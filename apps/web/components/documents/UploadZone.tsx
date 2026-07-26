"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { UploadCloud, File, X, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadCandidateDocument } from "@/app/actions/document";
import { useRouter } from "next/navigation";

interface UploadZoneProps {
  candidateId: string;
}

export default function UploadZone({ candidateId }: UploadZoneProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("Aadhaar");
  
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const documentTypes = [
    "Aadhaar", "PAN", "Passport", "Driving License", "Voter ID", 
    "Resume", "Experience Letter", "Salary Slip", "Education Certificate", 
    "Offer Letter", "Bank Statement", "Cancelled Cheque", 
    "Police Verification", "Court Record", "Reference Letter", "Other"
  ];

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setStatus(null);
    if (file.size > 25 * 1024 * 1024) {
      setStatus({ type: "error", message: "File exceeds 25MB limit" });
      return;
    }
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.type)) {
      setStatus({ type: "error", message: "Unsupported file type. Use PDF, PNG, or JPG." });
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("documentType", documentType);

    try {
      await uploadCandidateDocument(candidateId, formData);
      setStatus({ type: "success", message: "Document uploaded successfully!" });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStatus({ type: "error", message: err.message });
      } else {
        setStatus({ type: "error", message: "Failed to upload document" });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Upload Document</h3>
        <p className="text-sm text-slate-400">Securely upload a candidate document (Max 25MB)</p>
      </div>

      {status && (
        <div className={`mb-6 flex items-center gap-2 rounded-xl p-4 text-sm font-medium ${
          status.type === "success" 
            ? "bg-green-500/10 text-green-400 ring-1 ring-inset ring-green-500/20" 
            : "bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20"
        }`}>
          {status.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          {status.message}
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="documentType" className="mb-2 block text-sm font-medium text-slate-300">
          Document Type
        </label>
        <select
          id="documentType"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          disabled={isUploading}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
        >
          {documentTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition ${
            isDragging 
              ? "border-cyan-500 bg-cyan-500/5" 
              : "border-slate-700 bg-slate-950 hover:border-slate-600 hover:bg-slate-900"
          }`}
        >
          <UploadCloud className="mb-4 h-10 w-10 text-slate-400" />
          <p className="mb-1 font-medium text-slate-300">Click to upload or drag and drop</p>
          <p className="text-xs text-slate-500">PDF, PNG, JPG (max. 25MB)</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden" 
          />
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950 p-4">
          <div className="flex items-center gap-4 truncate">
            <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
              <File className="h-6 w-6" />
            </div>
            <div className="truncate">
              <p className="truncate font-medium text-slate-200">{selectedFile.name}</p>
              <p className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedFile(null)}
            disabled={isUploading}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-50"
            aria-label="Remove file"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="rounded-xl bg-cyan-500 px-6 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload Document"}
        </button>
      </div>
    </div>
  );
}
