import {
  PDFGenerationOptions,
  PDFGenerationResult
} from './types';
import {
  generateFilename
} from './utils';

/**
 * PDF Generator using server-side Puppeteer API
 */
export class PDFGenerator {
  /**
   * Generate PDF from HTML element using server-side API
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

      // Extract HTML content from the element
      const htmlContent = this.extractHTMLContent(element);

      // Prepare API request
      const requestBody = {
        html: htmlContent,
        options: {
          pageFormat: config.pageFormat,
          quality: config.quality === 1 ? 'ats' : 'standard'
        }
      };

      // Call the PDF generation API
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Get the PDF blob
      const pdfBlob = await response.blob();
      const fileSize = pdfBlob.size;

      // Trigger download
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = config.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Estimate page count (rough calculation)
      const pageCount = Math.max(1, Math.ceil(fileSize / 50000)); // ~50KB per page estimate

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
   * Extract HTML content from element, preserving styles
   */
  private static extractHTMLContent(element: HTMLElement): string {
    // Clone the element to avoid modifying the original
    const clone = element.cloneNode(true) as HTMLElement;

    // Get computed styles and inline them
    this.inlineStyles(clone, element);

    // Return the HTML content
    return clone.outerHTML;
  }

  /**
   * Inline computed styles to preserve appearance in PDF
   */
  private static inlineStyles(clonedElement: HTMLElement, originalElement: HTMLElement): void {
    const computedStyle = window.getComputedStyle(originalElement);
    
    // List of important styles to preserve
    const importantStyles = [
      'font-family', 'font-size', 'font-weight', 'font-style',
      'color', 'background-color', 'background-image',
      'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
      'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
      'border', 'border-top', 'border-right', 'border-bottom', 'border-left',
      'border-radius', 'text-align', 'line-height', 'letter-spacing',
      'display', 'position', 'width', 'height', 'max-width', 'max-height',
      'flex', 'flex-direction', 'justify-content', 'align-items',
      'grid', 'grid-template-columns', 'grid-gap', 'gap'
    ];

    // Apply styles to the cloned element
    importantStyles.forEach(property => {
      const value = computedStyle.getPropertyValue(property);
      if (value && value !== 'initial' && value !== 'inherit') {
        clonedElement.style.setProperty(property, value);
      }
    });

    // Recursively apply to children
    const originalChildren = originalElement.children;
    const clonedChildren = clonedElement.children;
    
    for (let i = 0; i < originalChildren.length; i++) {
      if (originalChildren[i] instanceof HTMLElement && clonedChildren[i] instanceof HTMLElement) {
        this.inlineStyles(clonedChildren[i] as HTMLElement, originalChildren[i] as HTMLElement);
      }
    }
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
