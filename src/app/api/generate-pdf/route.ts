import { generateTemplateCss } from '@/lib/pdf/templateToCss';
import { NextRequest, NextResponse } from 'next/server';
import puppeteer, { PDFOptions, PaperFormat } from 'puppeteer';

export async function POST(request: NextRequest) {
  try {
    const { html, options = {} } = await request.json();

    if (!html) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      );
    }

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

    // Extract options
    const pageFormat = options.pageFormat === 'A4' ? 'A4' : 'Letter';
    const quality = options.quality || 'standard'; // 'standard' or 'ats'
    const template = options.template || 'classic-professional';
    const layout = options.layout || 'single-column';

    // Set PDF options
    const pdfOptions: PDFOptions = {
      format: pageFormat as PaperFormat,
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    };

    // For ATS format, use lower quality settings
    if (quality === 'ats') {
      pdfOptions.preferCSSPageSize = false;
      pdfOptions.displayHeaderFooter = false;
    } else {
      // Standard format - higher quality
      pdfOptions.preferCSSPageSize = true;
      pdfOptions.displayHeaderFooter = false;
    }

    // Generate CSS based on template and layout
    const templateCss = generateTemplateCss(template, layout);
    
    // Create a complete HTML document with template-specific CSS
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CV Export</title>
        <style>
          ${templateCss}
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

    // Execute script to fix layout issues that might occur in Puppeteer
    await page.evaluate((layout) => {
      // Additional layout fixes for two-column layout
      if (layout === 'two-column') {
        const container = document.body.querySelector('.cv-container') as HTMLElement;
        if (container) {
          // Ensure the container has proper display
          container.style.display = 'flex';
          container.style.flexDirection = 'column';
          container.style.width = '100%';
          
          // Fix the two-column grid
          const twoColContainer = container.querySelector('.two-column') as HTMLElement;
          if (twoColContainer) {
            twoColContainer.style.display = 'grid';
            twoColContainer.style.gridTemplateColumns = 'minmax(200px, 1fr) minmax(400px, 2fr)';
            twoColContainer.style.width = '100%';
            twoColContainer.style.gap = '2rem';
          }
          
          // Ensure left column has proper styling
          const leftCol = container.querySelector('.two-column-left') as HTMLElement;
          if (leftCol) {
            leftCol.style.paddingRight = '1rem';
          }
          
          // Ensure right column has proper styling
          const rightCol = container.querySelector('.two-column-right') as HTMLElement;
          if (rightCol) {
            rightCol.style.borderLeft = '1px solid var(--secondary-color, #ddd)';
            rightCol.style.paddingLeft = '1rem';
          }
        }
      }
    }, layout);

    // Wait a bit more for any dynamic content and layout fixes to apply
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate PDF
    const pdfBuffer = await page.pdf(pdfOptions);

    await browser.close();

    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `cv-${quality}-${timestamp}.pdf`;

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { 
        error: 'PDF generation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
