import { templates } from '@/lib/templates';
import fs from 'fs';
import path from 'path';

/**
 * Generate CSS based on template and layout selection
 */
export function generateTemplateCss(templateId: string, layout: string): string {
  const template = templates[templateId] || templates['classic-professional'];
  const { colors, typography, spacing } = template.styles;
  
  // Get the base PDF CSS for consistent rendering
  let pdfCss = '';
  try {
    const pdfCssPath = path.join(process.cwd(), 'src', 'styles', 'pdf', 'pdf.css');
    if (fs.existsSync(pdfCssPath)) {
      pdfCss = fs.readFileSync(pdfCssPath, 'utf8');
    }
  } catch (error) {
    console.warn('Could not load PDF base CSS:', error);
  }

  // Get layout specific CSS
  let layoutCss = '';
  try {
    const layoutName = layout === 'two-column' ? 'two-column' : 'single-column';
    const layoutCssPath = path.join(process.cwd(), 'src', 'styles', 'layouts', `${layoutName}.css`);
    if (fs.existsSync(layoutCssPath)) {
      layoutCss = fs.readFileSync(layoutCssPath, 'utf8');
    }
  } catch (error) {
    console.warn(`Could not load ${layout} CSS:`, error);
  }
  
  return `
    /* CSS Variables for template customization */
    :root {
      --primary-color: ${colors.primary};
      --secondary-color: ${colors.secondary};
      --accent-color: ${colors.accent};
      --text-color: ${colors.text};
      
      --heading-font: ${typography.headingFont};
      --body-font: ${typography.bodyFont};
      
      --h1-size: ${typography.fontSize.h1};
      --h2-size: ${typography.fontSize.h2};
      --h3-size: ${typography.fontSize.h3};
      --body-size: ${typography.fontSize.body};
      
      --section-gap: ${spacing.sectionGap};
      --item-gap: ${spacing.itemGap};
      --content-padding: ${spacing.padding};
    }
    
    /* Reset and base styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: var(--body-font);
      color: var(--text-color);
      line-height: 1.6;
      background: white;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      margin: 0;
      padding: 0;
    }
    
    /* CV Styles with template variables */
    h1 {
      font-family: var(--heading-font);
      font-size: var(--h1-size);
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--primary-color);
    }
    
    h2 {
      font-family: var(--heading-font);
      font-size: var(--h2-size);
      font-weight: 600;
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: var(--primary-color);
      border-bottom: 2px solid var(--secondary-color);
      padding-bottom: 0.5rem;
    }
    
    h3 {
      font-family: var(--heading-font);
      font-size: var(--h3-size);
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
      color: var(--primary-color);
    }
    
    p {
      font-family: var(--body-font);
      font-size: var(--body-size);
      margin-bottom: 1rem;
      line-height: 1.7;
    }
    
    strong {
      font-weight: 600;
      color: var(--primary-color);
    }
    
    ul, ol {
      margin-left: 1.5rem;
      margin-bottom: 1rem;
    }
    
    li {
      font-family: var(--body-font);
      font-size: var(--body-size);
      margin-bottom: 0.5rem;
      line-height: 1.6;
    }
    
    a {
      color: var(--accent-color);
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

    /* Headshot specific styling */
    .cv-headshot {
      display: block;
      margin-bottom: 1rem;
    }
    
    .cv-headshot img {
      object-fit: cover;
      width: 150px;
      height: 150px;
    }
    
    .cv-headshot.circular img {
      border-radius: 50%;
    }
    
    /* Layout-specific CSS */
    ${layout === 'two-column' ? `
      .cv-container {
        display: flex;
        flex-direction: column;
        min-height: 100%;
        width: 100%;
        box-sizing: border-box;
        padding: var(--content-padding);
      }
      
      .two-column {
        display: grid;
        width: 100%;
        grid-template-columns: minmax(200px, 1fr) minmax(400px, 2fr);
        gap: 2rem;
        align-items: start;
      }
      
      .two-column-left {
        padding-right: 1rem;
      }
      
      .two-column-right {
        border-left: 1px solid var(--secondary-color);
        padding-left: 1rem;
      }
    ` : `
      .cv-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 8.5in;
        margin: 0 auto;
        padding: var(--content-padding);
      }
      
      .single-column {
        width: 100%;
      }
    `}
    
    /* Contact info styling */
    .cv-contact-info {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .cv-contact-item {
      display: flex;
      align-items: center;
      margin-right: 1rem;
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
    
    /* Override any hidden/positioned elements for PDF generation */
    .cv-preview-content, .cv-pdf-export {
      position: static !important;
      left: auto !important;
      top: auto !important;
      visibility: visible !important;
      pointer-events: auto !important;
      z-index: auto !important;
      transform: none !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    /* Include base PDF CSS */
    ${pdfCss}
    
    /* Include layout-specific CSS */
    ${layoutCss}
  `;
}
