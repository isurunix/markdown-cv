import { Page } from '@playwright/test';
import { readFile } from 'fs/promises';
import path from 'path';

/**
 * Load CV content from fixture file
 */
export const loadCVFixture = async (fixtureName: string): Promise<string> => {
  const fixturePath = path.join(__dirname, '..', 'fixtures', `${fixtureName}.md`);
  return await readFile(fixturePath, 'utf-8');
};

/**
 * Clear editor and input new CV content
 */
export const inputCVContent = async (page: Page, content: string): Promise<void> => {
  // Wait for Monaco editor to be loaded
  await page.waitForSelector('.monaco-editor', { timeout: 10000 });
  
  // Click on the Monaco editor to focus it (using nth(0) to get the first one)
  const monacoEditor = page.locator('.monaco-editor').nth(0);
  await monacoEditor.click();
  await page.waitForTimeout(500);
  
  // Select all existing content using Monaco-compatible key combination
  await page.keyboard.press('ControlOrMeta+KeyA');
  await page.waitForTimeout(200);
  
  // Type the new content directly
  await page.keyboard.type(content, { delay: 10 });
  
  // Wait for the preview to update
  await page.waitForTimeout(3000);
  
  // Verify the content was actually updated by checking if the name changed
  const nameInPreview = await page.evaluate(() => {
    const nameEl = document.querySelector('.cv-name, h1');
    return nameEl?.textContent?.trim() || '';
  });
  
  // Extract expected name from markdown content (first line after #)
  const expectedName = content.match(/^#\s*(.+)$/m)?.[1]?.trim() || '';
  
  if (expectedName && !nameInPreview.includes(expectedName)) {
    console.warn(`Content update verification failed. Expected name: "${expectedName}", Found: "${nameInPreview}"`);
    
    // Log Monaco display content for debugging
    const displayContent = await page.evaluate(() => {
      const monacoDiv = document.querySelector('.monaco-editor');
      if (monacoDiv) {
        const lines = monacoDiv.querySelectorAll('.view-line');
        return Array.from(lines).map(line => line.textContent).join('\n');
      }
      return 'Could not read Monaco display content';
    });
    console.log('Monaco display content:', displayContent.substring(0, 200));
  } else {
    console.log(`✅ Content successfully updated. Name in preview: "${nameInPreview}"`);
  }
};

/**
 * Switch between CV templates
 */
export const switchTemplate = async (page: Page, templateName: string): Promise<void> => {
  // Click the template selector button (has Palette icon)
  const templateButton = page.locator('button').filter({ has: page.locator('svg.lucide-palette') });
  
  await templateButton.click();
  await page.waitForTimeout(500); // Wait for dropdown to open
  
  // Click the specific template in the dropdown
  const templateOption = page.locator(`button:has-text("${templateName}")`);
  await templateOption.click();
  await page.waitForTimeout(1000); // Wait for template switch
};

/**
 * Switch page format
 */
export const switchPageFormat = async (page: Page, format: 'A4' | 'US Letter'): Promise<void> => {
  await page.selectOption('select[data-testid="page-format"], select:has(option[value="A4"])', format);
  await page.waitForTimeout(1000); // Wait for format change
};

/**
 * Generate PDF for testing using the backend API (bypasses UI download)
 */
export const generateTestPDF = async (
  page: Page, 
  format: 'standard' | 'ats' = 'standard',
  pageFormat: 'A4' | 'US Letter' = 'US Letter'
): Promise<Buffer> => {
  // Wait for the CV preview to be fully loaded
  await page.waitForSelector('.cv-preview-content, .cv-pdf-export', { timeout: 10000 });
  
  // Extract HTML content from the preview element
  const htmlContent = await page.evaluate(() => {
    // Try to find the preview element
    const previewElement = document.querySelector('.cv-pdf-export') ||
                          document.querySelector('.cv-preview-content') ||
                          document.querySelector('.cv-preview-pages .cv-preview-page:first-child');
    
    if (!previewElement) {
      throw new Error('CV preview element not found');
    }

    // Debug: log what content we're actually extracting
    console.log('Extracting PDF content from element:', previewElement.className);
    console.log('Name found:', previewElement.querySelector('.cv-name')?.textContent);
    console.log('Title found:', previewElement.querySelector('.cv-title')?.textContent);
    console.log('Email found:', previewElement.textContent?.match(/[\w\.-]+@[\w\.-]+\.\w+/)?.[0]);

    // Clone the element to avoid modifying the original
    const clone = previewElement.cloneNode(true) as HTMLElement;
    
    // Get computed styles and inline them for better PDF rendering
    function inlineStyles(element: HTMLElement, originalElement: HTMLElement): void {
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

      // Apply styles to the element
      importantStyles.forEach(property => {
        const value = computedStyle.getPropertyValue(property);
        if (value && value !== 'initial' && value !== 'inherit') {
          element.style.setProperty(property, value);
        }
      });

      // Recursively apply to children
      const originalChildren = originalElement.children;
      const clonedChildren = element.children;
      
      for (let i = 0; i < originalChildren.length; i++) {
        if (originalChildren[i] instanceof HTMLElement && clonedChildren[i] instanceof HTMLElement) {
          inlineStyles(clonedChildren[i] as HTMLElement, originalChildren[i] as HTMLElement);
        }
      }
    }

    // Inline styles for better PDF rendering
    inlineStyles(clone, previewElement as HTMLElement);
    
    return clone.outerHTML;
  });

  // Make request to the backend API
  const baseURL = new URL(page.url()).origin;
  
  // Debug: log the HTML content being sent
  console.log('HTML content length:', htmlContent.length);
  console.log('HTML preview (first 200 chars):', htmlContent.substring(0, 200));
  
  const response = await fetch(`${baseURL}/api/generate-pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      html: htmlContent,
      options: {
        pageFormat: pageFormat,
        quality: format === 'ats' ? 'ats' : 'standard'
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`PDF generation failed: ${errorData.error || response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

/**
 * Export PDF and return the downloaded file buffer (original UI-based method)
 */
export const exportPDF = async (page: Page, format: 'standard' | 'ats' = 'standard'): Promise<Buffer> => {
  // Step 1: Click the main Export PDF button to open dropdown
  const mainExportButton = page.locator('button:has-text("Export PDF")').first();
  
  if (await mainExportButton.isVisible({ timeout: 5000 })) {
    await mainExportButton.click();
    console.log('Clicked main Export PDF button');
    
    // Wait for dropdown to appear
    await page.waitForTimeout(500);
    
    // Step 2: Click the specific format option in the dropdown
    const formatText = format === 'standard' ? 'Standard PDF' : 'ATS-Friendly PDF';
    const formatButton = page.locator(`button:has-text("${formatText}")`).first();
    
    if (await formatButton.isVisible({ timeout: 3000 })) {
      console.log(`Clicking format button: ${formatText}`);
      
      // Set up download promise before clicking
      const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
      
      await formatButton.click();
      
      // Wait for download
      const download = await downloadPromise;
      
      // Get the downloaded file
      const buffer = await download.createReadStream();
      const chunks: Buffer[] = [];
      
      return new Promise((resolve, reject) => {
        buffer.on('data', (chunk) => chunks.push(chunk));
        buffer.on('end', () => resolve(Buffer.concat(chunks)));
        buffer.on('error', reject);
      });
    } else {
      // Debug: log all available buttons in the dropdown
      const allButtons = await page.locator('button').all();
      for (const button of allButtons) {
        const text = await button.textContent();
        console.log(`Available button: ${text}`);
      }
      
      throw new Error(`Could not find ${formatText} button in export dropdown`);
    }
  } else {
    throw new Error('Export PDF button not found');
  }
};

/**
 * Wait for the application to be fully loaded
 */
export const waitForAppReady = async (page: Page): Promise<void> => {
  // Wait for main elements to be loaded
  await page.waitForSelector('.cv-preview-content, .monaco-editor', { timeout: 30000 });
  
  // Wait for any initial loading to complete
  await page.waitForFunction(() => {
    const preview = document.querySelector('.cv-preview-content');
    return preview && preview.textContent && preview.textContent.trim().length > 0;
  }, { timeout: 15000 });
  
  // Additional wait for stabilization
  await page.waitForTimeout(2000);
};

/**
 * Check if element exists without throwing
 */
export const elementExists = async (page: Page, selector: string): Promise<boolean> => {
  try {
    const element = await page.locator(selector).first();
    return await element.isVisible({ timeout: 1000 });
  } catch {
    return false;
  }
};

/**
 * Get page count from the UI
 */
export const getPageCount = async (page: Page): Promise<number> => {
  try {
    // Look for page count indicator
    const pageCountText = await page.textContent('[data-testid="page-count"], .page-count, span:has-text("page")');
    if (pageCountText) {
      const match = pageCountText.match(/(\d+)\s*page/);
      return match ? parseInt(match[1], 10) : 1;
    }
  } catch {
    // Fallback: count visible pages in page view
    try {
      const pages = await page.locator('.cv-preview-page').count();
      return pages > 0 ? pages : 1;
    } catch {
      return 1;
    }
  }
  return 1;
};

/**
 * Take screenshot for debugging
 */
export const takeDebugScreenshot = async (page: Page, name: string): Promise<void> => {
  const screenshotPath = path.join(__dirname, '..', '..', 'test-results', `debug-${name}-${Date.now()}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Debug screenshot saved: ${screenshotPath}`);
};

/**
 * Toggle between single view and pages view
 */
export const togglePageView = async (page: Page, viewMode: 'single' | 'pages'): Promise<void> => {
  const currentMode = viewMode === 'pages' ? 'Show Pages' : 'Single View';
  
  const toggleButton = page.locator(`button:has-text("${currentMode}"), [data-testid="view-toggle"]`);
  
  if (await toggleButton.isVisible({ timeout: 2000 })) {
    await toggleButton.click();
    await page.waitForTimeout(1000);
  }
};

/**
 * Validate that the export was successful
 */
export const validateExportSuccess = (buffer: Buffer): void => {
  if (!buffer || buffer.length === 0) {
    throw new Error('PDF export failed - empty buffer received');
  }
  
  // Check PDF magic number
  const pdfHeader = buffer.slice(0, 4).toString();
  if (!pdfHeader.startsWith('%PDF')) {
    throw new Error('PDF export failed - invalid PDF format');
  }
  
  // Basic size check (PDFs should be at least a few KB)
  if (buffer.length < 1024) {
    throw new Error('PDF export failed - file too small');
  }
};
