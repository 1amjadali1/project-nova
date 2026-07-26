import { IOcrProvider, OcrResult } from "../provider";

export class OpenAIOCRProvider implements IOcrProvider {
  async processDocument(_documentId: string, _documentUrl: string, _documentType: string): Promise<OcrResult> {
    throw new Error("OpenAIOCRProvider is not yet implemented. Requires openai SDK.");
  }
}
