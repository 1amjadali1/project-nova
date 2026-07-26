import { IOcrProvider, OcrResult } from "../provider";

export class TesseractProvider implements IOcrProvider {
  async processDocument(_documentId: string, _documentUrl: string, _documentType: string): Promise<OcrResult> {
    throw new Error("TesseractProvider is not yet implemented. Requires tesseract.js SDK.");
  }
}
