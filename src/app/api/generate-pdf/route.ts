import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

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

    // Set page format based on options
    const pageFormat = options.pageFormat === 'A4' ? 'A4' : 'Letter';
    const quality = options.quality || 'standard'; // 'standard' or 'ats'

    // Set PDF options
    const pdfOptions: any = {
      format: pageFormat,
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

    // Create a complete HTML document with proper CSS
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
          }
          
          /* Override any hidden/positioned elements for PDF generation */
          .cv-preview-content, .cv-pdf-export {
            position: static !important;
            left: auto !important;
            top: auto !important;
            visibility: visible !important;
            pointer-events: auto !important;
            z-index: auto !important;
            transform: none !important;
          }
          
          /* CV Styles */
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
          
          a:hover {
            text-decoration: underline;
          }
          
          img {
            max-width: 200px;
            height: auto;
            border-radius: 8px;
            margin: 1rem 0;
          }
          
          /* Page break control */
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
          
          /* Two column layout if specified */
          .two-column {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 2rem;
            align-items: start;
          }
          
          .single-column {
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1rem;
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
