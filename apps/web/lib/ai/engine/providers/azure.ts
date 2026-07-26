import { IOcrProvider, OcrResult } from "../provider";

export class AzureOCRProvider implements IOcrProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async processDocument(_documentId: string, _documentUrl: string, _documentType: string): Promise<OcrResult> {
    throw new Error("AzureOCRProvider is not yet implemented. Requires @azure/ai-form-recognizer SDK.");
  }
}
