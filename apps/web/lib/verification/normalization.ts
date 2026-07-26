export class NormalizationEngine {
  
  static cleanString(input?: string | null): string {
    if (!input) return "";
    return input
      .trim()
      .replace(/\s+/g, " ") // normalize whitespace
      .toUpperCase(); // upper case for standard comparison
  }

  static cleanAlphaNumeric(input?: string | null): string {
    if (!input) return "";
    return input.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  }

  static cleanDate(input?: string | null): string {
    if (!input) return "";
    
    // Attempt basic parsing, assume DD-MM-YYYY or YYYY-MM-DD
    const cleaned = input.replace(/[\/\.]/g, "-");
    
    // If we can parse it to an ISO string part, do so
    const d = new Date(cleaned);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split("T")[0];
    }
    
    return cleaned;
  }
}
