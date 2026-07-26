import { IOcrProvider, OcrResult } from "../provider";

export class GoogleOCRProvider implements IOcrProvider {
  async processDocument(_documentId: string, _documentUrl: string, _documentType: string): Promise<OcrResult> {
    throw new Error("GoogleOCRProvider is not yet implemented. Requires @google-cloud/vision SDK.");
  }
}
