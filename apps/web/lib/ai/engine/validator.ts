import { ExtractedField } from "./provider";

export interface ValidatedField extends ExtractedField {
  validationError: string | null;
  isValid: boolean;
}

export interface ValidationResult {
  fields: ValidatedField[];
  overallValidationScore: number;
}

export function validateExtraction(documentType: string, fields: ExtractedField[]): ValidationResult {
  let validCount = 0;
  
  const validatedFields: ValidatedField[] = fields.map(field => {
    let error: string | null = null;

    if (!field.fieldValue || field.fieldValue.trim() === "") {
      error = "Field is empty";
    } else {
      switch (documentType.toUpperCase()) {
        case "PAN":
          if (field.fieldName === "document_number") {
            const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
            if (!panRegex.test(field.fieldValue)) {
              error = "Invalid PAN format (expected ABCDE1234F)";
            }
          }
          break;
        case "AADHAAR":
          if (field.fieldName === "document_number") {
            const aadhaarRegex = /^\d{4}\s\d{4}\s\d{4}$|^\d{12}$/;
            if (!aadhaarRegex.test(field.fieldValue)) {
              error = "Invalid Aadhaar format (expected 12 digits)";
            }
          }
          break;
        case "RESUME":
          if (field.fieldName === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.fieldValue)) {
              error = "Invalid email format";
            }
          }
          break;
      }
    }

    if (!error) validCount++;

    return {
      ...field,
      validationError: error,
      isValid: error === null,
    };
  });

  const score = fields.length > 0 ? (validCount / fields.length) * 100 : 0;

  return {
    fields: validatedFields,
    overallValidationScore: score,
  };
}
