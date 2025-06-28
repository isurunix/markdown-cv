import { PDFPageDimensions } from './types';

// Page format dimensions in millimeters
export const PAGE_FORMATS: Record<'A4' | 'US Letter', PDFPageDimensions> = {
  'A4': { width: 210, height: 297 },
  'US Letter': { width: 216, height: 279 }
};

// PDF quality settings
export const QUALITY_SETTINGS = {
  ATS: {
    scale: 1.5,     // Lower scale for smaller file size
    quality: 0.8,   // PNG compression quality
    dpi: 150        // Lower DPI for ATS compatibility
  },
  STANDARD: {
    scale: 2,       // Higher scale for crisp text
    quality: 0.95,  // High PNG compression quality
    dpi: 300        // High DPI for print quality
  }
};

// Canvas rendering options
export const CANVAS_OPTIONS = {
  useCORS: true,
  allowTaint: false,
  backgroundColor: '#ffffff',
  imageTimeout: 10000, // 10 seconds timeout for images
  logging: false
};

/**
 * Calculate optimal PDF dimensions based on canvas and page format
 */
export const calculatePDFDimensions = (
  canvas: HTMLCanvasElement,
  pageFormat: 'A4' | 'US Letter'
) => {
  const format = PAGE_FORMATS[pageFormat];
  const imgWidth = format.width;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  return {
    imgWidth,
    imgHeight,
    pageWidth: format.width,
    pageHeight: format.height
  };
};

/**
 * Generate a filename with timestamp
 */
export const generateFilename = (format: 'standard' | 'ats'): string => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  return `cv-${format}-${timestamp}.pdf`;
};
