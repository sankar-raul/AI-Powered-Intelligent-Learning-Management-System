export function cleanText(text: string): string {
  // Remove excessive whitespace
  text = text.replace(/\s+/g, " ");

  // Remove standalone page numbers
  text = text.replace(/\bPage\s+\d+\b/gi, "");

  // Strip leading/trailing spaces
  return text.trim();
}
