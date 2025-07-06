import { Page as PlaywrightPage } from '@playwright/test';
import puppeteer from 'puppeteer';

/**
 * Generate PDF using Puppeteer directly for testing purposes
 * This bypasses the API and generates PDFs directly in the test environment
 */
export class TestPDFGenerator {
  /**
   * Generate PDF from the current page content using Puppeteer
   */
  static async generatePDFFromPage(
    playwrightPage: PlaywrightPage,
    format: 'standard' | 'ats' = 'standard',
    pageFormat: 'A4' | 'US Letter' = 'US Letter'
  ): Promise<Buffer> {
    try {
      // Get the current page URL to navigate Puppeteer to the same page
      const currentURL = playwrightPage.url();
      
      // Launch Puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });

      const page = await browser.newPage();

      // Navigate to the same URL as Playwright
      await page.goto(currentURL, {
        waitUntil: ['networkidle0', 'domcontentloaded']
      });

      // Wait for the CV preview to be loaded
      await page.waitForSelector('.cv-preview-content, .cv-pdf-export', { timeout: 10000 });

      // Get the CV content element
      const cvContent = await page.$('.cv-pdf-export, .cv-preview-content');
      if (!cvContent) {
        throw new Error('CV content not found for PDF generation');
      }

      // Set PDF options
      const pdfOptions: any = {
        format: pageFormat === 'A4' ? 'A4' : 'Letter',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        },
        preferCSSPageSize: true,
        displayHeaderFooter: false
      };

      // For ATS format, use simpler settings
      if (format === 'ats') {
        pdfOptions.preferCSSPageSize = false;
        pdfOptions.margin = {
          top: '0.25in',
          right: '0.25in',
          bottom: '0.25in',
          left: '0.25in'
        };
      }

      // Generate PDF
      const pdfBuffer = await page.pdf(pdfOptions);

      await browser.close();

      return Buffer.from(pdfBuffer);

    } catch (error) {
      throw new Error(`Test PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate PDF from HTML content directly
   */
  static async generatePDFFromHTML(
    html: string,
    format: 'standard' | 'ats' = 'standard',
    pageFormat: 'A4' | 'US Letter' = 'US Letter'
  ): Promise<Buffer> {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });

      const page = await browser.newPage();

      // Create a complete HTML document with CV styles
      const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>CV Export</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
              line-height: 1.6;
              color: #333;
              background: white;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              padding: 1rem;
            }
            
            h1 {
              font-size: 2.5rem;
              font-weight: 700;
              margin-bottom: 0.5rem;
              color: #1f2937;
            }
            
            h2 {
              font-size: 1.5rem;
              font-weight: 600;
              margin-top: 2rem;
              margin-bottom: 1rem;
              color: #374151;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 0.5rem;
            }
            
            h3 {
              font-size: 1.25rem;
              font-weight: 600;
              margin-top: 1.5rem;
              margin-bottom: 0.5rem;
              color: #374151;
            }
            
            p {
              margin-bottom: 1rem;
              line-height: 1.7;
            }
            
            strong {
              font-weight: 600;
              color: #1f2937;
            }
            
            ul, ol {
              margin-left: 1.5rem;
              margin-bottom: 1rem;
            }
            
            li {
              margin-bottom: 0.5rem;
              line-height: 1.6;
            }
            
            a {
              color: #2563eb;
              text-decoration: none;
            }
            
            img {
              max-width: 200px;
              height: auto;
              border-radius: 8px;
              margin: 1rem 0;
            }
            
            @media print {
              .page-break {
                page-break-before: always;
              }
              
              h1, h2, h3 {
                page-break-after: avoid;
              }
              
              p, li {
                page-break-inside: avoid;
                orphans: 2;
                widows: 2;
              }
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
        </html>
      `;

      // Set content and wait for load
      await page.setContent(fullHtml, {
        waitUntil: ['networkidle0', 'domcontentloaded']
      });

      // Wait a bit more for any dynamic content
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Set PDF options
      const pdfOptions: any = {
        format: pageFormat === 'A4' ? 'A4' : 'Letter',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        },
        preferCSSPageSize: true,
        displayHeaderFooter: false
      };

      // For ATS format, use simpler settings
      if (format === 'ats') {
        pdfOptions.preferCSSPageSize = false;
        pdfOptions.margin = {
          top: '0.25in',
          right: '0.25in',
          bottom: '0.25in',
          left: '0.25in'
        };
      }

      // Generate PDF
      const pdfBuffer = await page.pdf(pdfOptions);

      await browser.close();

      return Buffer.from(pdfBuffer);

    } catch (error) {
      throw new Error(`PDF generation from HTML failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
