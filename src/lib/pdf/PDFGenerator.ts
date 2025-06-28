import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
    PDFGenerationOptions,
    PDFGenerationResult
} from './types';
import {
    calculatePDFDimensions,
    CANVAS_OPTIONS,
    generateFilename,
    QUALITY_SETTINGS
} from './utils';

export class PDFGenerator {
  /**
   * Generate PDF from HTML element
   */
  static async generateFromElement(
    element: HTMLElement,
    options: Partial<PDFGenerationOptions> = {}
  ): Promise<PDFGenerationResult> {
    try {
      // Set default options
      const config: PDFGenerationOptions = {
        filename: options.filename || generateFilename('standard'),
        pageFormat: options.pageFormat || 'US Letter',
        quality: options.quality || 2,
        ...options
      };

      // Get quality settings based on quality level
      const qualitySettings = config.quality === 1 
        ? QUALITY_SETTINGS.ATS 
        : QUALITY_SETTINGS.STANDARD;

      // Prepare element for capture
      await this.prepareElementForCapture(element);

      // Capture element as canvas
      const canvas = await html2canvas(element, {
        ...CANVAS_OPTIONS,
        scale: qualitySettings.scale,
      } as any); // Type assertion for scale property

      // Calculate PDF dimensions
      const dimensions = calculatePDFDimensions(canvas, config.pageFormat);

      // Create PDF document
      const pdf = new jsPDF('portrait', 'mm', config.pageFormat === 'A4' ? 'a4' : 'letter');

      // Add canvas to PDF with multi-page support
      const pageCount = await this.addCanvasToPDF(pdf, canvas, dimensions);

      // Save PDF
      pdf.save(config.filename);

      // Calculate file size (approximate)
      const pdfBlob = pdf.output('blob');
      const fileSize = pdfBlob.size;

      return {
        success: true,
        fileSize,
        pageCount
      };

    } catch (error) {
      console.error('PDF generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Prepare element for high-quality capture
   */
  private static async prepareElementForCapture(element: HTMLElement): Promise<void> {
    // Ensure all images are loaded
    const images = element.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      
      return new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        // Add timeout for external images
        setTimeout(() => resolve(null), 5000);
      });
    });

    await Promise.allSettled(imagePromises);

    // Force layout recalculation
    element.style.transform = 'translateZ(0)';
    element.offsetHeight; // Trigger reflow
    element.style.transform = '';
  }

  /**
   * Add canvas to PDF with multi-page support
   */
  private static async addCanvasToPDF(
    pdf: jsPDF,
    canvas: HTMLCanvasElement,
    dimensions: ReturnType<typeof calculatePDFDimensions>
  ): Promise<number> {
    const { imgWidth, imgHeight, pageHeight } = dimensions;
    
    // Convert canvas to image data
    const imgData = canvas.toDataURL('image/png', 0.95);
    
    let heightLeft = imgHeight;
    let position = 0;
    let pageCount = 0;

    // Add pages as needed
    while (heightLeft > 0) {
      if (pageCount > 0) {
        pdf.addPage();
      }
      
      // For pages after the first, we need to offset the position
      const yPosition = pageCount > 0 ? position : 0;
      
      pdf.addImage(imgData, 'PNG', 0, yPosition, imgWidth, imgHeight);
      
      heightLeft -= pageHeight;
      position = position - pageHeight; // Move up for next page
      pageCount++;

      // Safety check to prevent infinite loops
      if (pageCount > 20) {
        console.warn('PDF generation stopped at 20 pages to prevent infinite loop');
        break;
      }
    }

    return pageCount;
  }

  /**
   * Generate ATS-optimized PDF
   */
  static async generateATSPDF(
    element: HTMLElement,
    pageFormat: 'A4' | 'US Letter' = 'US Letter'
  ): Promise<PDFGenerationResult> {
    return this.generateFromElement(element, {
      filename: generateFilename('ats'),
      pageFormat,
      quality: 1 // Low quality for ATS compatibility
    });
  }

  /**
   * Generate standard high-quality PDF
   */
  static async generateStandardPDF(
    element: HTMLElement,
    pageFormat: 'A4' | 'US Letter' = 'US Letter'
  ): Promise<PDFGenerationResult> {
    return this.generateFromElement(element, {
      filename: generateFilename('standard'),
      pageFormat,
      quality: 2 // High quality for standard use
    });
  }
}
