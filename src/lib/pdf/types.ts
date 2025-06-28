// PDF-related type definitions
export interface PDFGenerationOptions {
  filename: string;
  pageFormat: 'A4' | 'US Letter';
  quality: number; // 1 = low quality (ATS), 2 = high quality (standard)
}

export interface PDFPageDimensions {
  width: number;  // in mm
  height: number; // in mm
}

export interface PDFGenerationResult {
  success: boolean;
  error?: string;
  fileSize?: number; // in bytes
  pageCount?: number;
}
