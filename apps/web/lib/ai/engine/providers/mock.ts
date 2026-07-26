import { IOcrProvider, OcrResult, ExtractedField } from "../provider";

export class MockOCRProvider implements IOcrProvider {
  async processDocument(documentId: string, documentUrl: string, documentType: string): Promise<OcrResult> {
    // Simulate network delay 2-5 seconds
    const delay = Math.floor(Math.random() * 3000) + 2000;
    await new Promise(resolve => setTimeout(resolve, delay));

    let structuredData: ExtractedField[] = [];
    let rawText = "";

    const randConf = () => Math.floor(Math.random() * 30) + 70; // 70-100

    switch (documentType.toUpperCase()) {
      case "AADHAAR":
        structuredData = [
          { fieldName: "document_number", fieldValue: "1234 5678 9012", confidence: randConf() },
          { fieldName: "name", fieldValue: "John Doe", confidence: randConf() },
          { fieldName: "dob", fieldValue: "15/08/1990", confidence: randConf() },
          { fieldName: "gender", fieldValue: "Male", confidence: randConf() },
        ];
        rawText = "Government of India\nJohn Doe\nDOB: 15/08/1990\nMALE\n1234 5678 9012";
        break;

      case "PAN":
        // 10% chance to generate a bad PAN to test validation
        const panStr = Math.random() > 0.9 ? "ABCDE1234" : "ABCDE1234F";
        structuredData = [
          { fieldName: "document_number", fieldValue: panStr, confidence: randConf() },
          { fieldName: "name", fieldValue: "Jane Smith", confidence: randConf() },
          { fieldName: "father_name", fieldValue: "Robert Smith", confidence: randConf() },
          { fieldName: "dob", fieldValue: "01/01/1985", confidence: randConf() },
        ];
        rawText = "INCOME TAX DEPARTMENT\nGOVT. OF INDIA\nJane Smith\nRobert Smith\n01/01/1985\n" + panStr;
        break;

      case "PASSPORT":
        structuredData = [
          { fieldName: "document_number", fieldValue: "Z1234567", confidence: randConf() },
          { fieldName: "name", fieldValue: "Alice Williams", confidence: randConf() },
          { fieldName: "nationality", fieldValue: "INDIAN", confidence: randConf() },
          { fieldName: "expiry_date", fieldValue: "10/10/2030", confidence: randConf() },
        ];
        rawText = "REPUBLIC OF INDIA\nPASSPORT\nAlice Williams\nINDIAN\nZ1234567\n10/10/2030";
        break;

      case "RESUME":
        structuredData = [
          { fieldName: "name", fieldValue: "Michael Tech", confidence: randConf() },
          { fieldName: "email", fieldValue: "michael.tech@example.com", confidence: randConf() },
          { fieldName: "phone", fieldValue: "+91 9876543210", confidence: randConf() },
          { fieldName: "skills", fieldValue: "React, Node.js, TypeScript, PostgreSQL", confidence: Math.floor(Math.random() * 20) + 60 }, // lower conf
          { fieldName: "experience", fieldValue: "5 Years", confidence: randConf() },
        ];
        rawText = "Michael Tech\nmichael.tech@example.com | +91 9876543210\nSenior Software Engineer\nSkills: React, Node.js, TypeScript, PostgreSQL\nExperience: 5 Years building scalable systems.";
        break;

      default:
        structuredData = [
          { fieldName: "document_type", fieldValue: documentType, confidence: randConf() },
          { fieldName: "text_block_1", fieldValue: "Lorem ipsum dolor sit amet", confidence: Math.floor(Math.random() * 40) + 40 },
        ];
        rawText = "Generic document content block extracted successfully.";
        break;
    }

    // Calculate overall confidence (average of all fields)
    const overallConfidence = structuredData.length > 0 
      ? structuredData.reduce((acc, curr) => acc + curr.confidence, 0) / structuredData.length
      : 0;

    return {
      rawText,
      structuredData,
      overallConfidence,
      provider: "MOCK",
      modelVersion: "v1.0-simulated",
    };
  }
}
