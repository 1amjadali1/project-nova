export interface ExtractedField {
  fieldName: string;
  fieldValue: string;
  confidence: number;
}

export interface OcrResult {
  rawText: string;
  structuredData: ExtractedField[];
  overallConfidence: number;
  provider: string;
  modelVersion: string;
}

export interface IOcrProvider {
  /**
   * Process a document to extract structured and raw text data.
   * @param documentId Internal ID for mock generation
   * @param documentUrl Secure URL to download the document
   * @param documentType The expected type (PAN, Aadhaar, Resume, etc)
   */
  processDocument(documentId: string, documentUrl: string, documentType: string): Promise<OcrResult>;
}
