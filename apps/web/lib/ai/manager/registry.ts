import { IOcrProvider } from "../engine/provider";
import { MockOCRProvider } from "../engine/providers/mock";
import { GoogleOCRProvider } from "../engine/providers/google";
import { AzureOCRProvider } from "../engine/providers/azure";
import { OpenAIOCRProvider } from "../engine/providers/openai";
import { TesseractProvider } from "../engine/providers/tesseract";

class ProviderRegistry {
  private providers: Map<string, IOcrProvider> = new Map();

  constructor() {
    this.register("MOCK", new MockOCRProvider());
    this.register("GOOGLE", new GoogleOCRProvider());
    this.register("AZURE", new AzureOCRProvider());
    this.register("OPENAI", new OpenAIOCRProvider());
    this.register("TESSERACT", new TesseractProvider());
  }

  register(code: string, provider: IOcrProvider) {
    this.providers.set(code.toUpperCase(), provider);
  }

  getProvider(code: string): IOcrProvider {
    const provider = this.providers.get(code.toUpperCase());
    if (!provider) {
      throw new Error(`Provider implementation for '${code}' not found in registry.`);
    }
    return provider;
  }
}

export const providerRegistry = new ProviderRegistry();
