"use client";

import { useState } from "react";
import DocumentCard, { DocumentInfo } from "@/components/documents/DocumentCard";
import DocumentPreview from "@/components/documents/DocumentPreview";
import { softDeleteDocument } from "@/app/actions/document";

interface WrapperProps {
  documents: DocumentInfo[];
}

export default function DocumentPreviewWrapper({ documents }: WrapperProps) {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [docs, setDocs] = useState(documents);

  const handlePreview = (id: string) => {
    setPreviewId(id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    
    try {
      await softDeleteDocument(id);
      setDocs(docs.filter(d => d.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete document");
    }
  };

  const previewDoc = documents.find(d => d.id === previewId);

  return (
    <>
      {docs.map((doc) => (
        <DocumentCard 
          key={doc.id} 
          document={doc} 
          onPreview={handlePreview} 
          onDelete={handleDelete}
        />
      ))}

      {previewId && previewDoc && (
        <DocumentPreview 
          documentId={previewDoc.id}
          mimeType={previewDoc.mimeType}
          fileName={previewDoc.originalFileName}
          onClose={() => setPreviewId(null)}
        />
      )}
    </>
  );
}
