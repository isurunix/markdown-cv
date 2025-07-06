import { expect, test } from '@playwright/test';
import {
    extractPreviewContent,
    waitForCVPreviewToLoad
} from '../utils/cv-content-extractor';
import {
    exportPDF,
    inputCVContent,
    loadCVFixture,
    takeDebugScreenshot,
    validateExportSuccess,
    waitForAppReady
} from '../utils/test-helpers';

test.describe('CV Builder Functional Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
  });

  test('Preview displays CV content correctly', async ({ page }) => {
    // Load the sample CV content
    const cvContent = await loadCVFixture('sample-cv');
    
    // Input CV content into editor
    await inputCVContent(page, cvContent);
    
    // Wait for preview to update
    await waitForCVPreviewToLoad(page);
    
    // Extract content from preview
    const previewContent = await extractPreviewContent(page);
    
    // Verify preview displays the correct content
    expect(previewContent.fullText.length).toBeGreaterThan(100);
    expect(previewContent.name).toContain('Jane Smith');
    expect(previewContent.title).toContain('UX Designer');
    expect(previewContent.contactInfo.email).toContain('jane.smith@email.com');
    expect(previewContent.contactInfo.phone).toContain('555-123-4567');
    
    // Verify key sections are present
    expect(previewContent.fullText).toContain('Professional Summary');
    expect(previewContent.fullText).toContain('Experience');
    expect(previewContent.fullText).toContain('Skills');
    expect(previewContent.fullText).toContain('Education');
    expect(previewContent.fullText).toContain('DesignCorp');
    expect(previewContent.fullText).toContain('StartupXYZ');
    
    console.log('✅ Preview content verification passed');
    console.log(`Preview contains ${previewContent.fullText.length} characters`);
  });

  test('PDF export generates valid files', async ({ page }) => {
    const cvContent = await loadCVFixture('sample-cv');
    await inputCVContent(page, cvContent);
    await waitForCVPreviewToLoad(page);
    
    // Test Standard PDF export
    const standardPDF = await exportPDF(page, 'standard');
    validateExportSuccess(standardPDF);
    
    // Verify PDF properties
    expect(standardPDF.length).toBeGreaterThan(10000); // Should be substantial size
    
    // Test ATS PDF export
    const atsPDF = await exportPDF(page, 'ats');
    validateExportSuccess(atsPDF);
    
    // Verify ATS PDF properties
    expect(atsPDF.length).toBeGreaterThan(5000); // ATS might be smaller but still substantial
    
    console.log(`✅ PDF exports successful:`);
    console.log(`Standard PDF: ${Math.round(standardPDF.length / 1024)}KB`);
    console.log(`ATS PDF: ${Math.round(atsPDF.length / 1024)}KB`);
  });

  test('Extended CV content displays correctly', async ({ page }) => {
    const extendedCV = await loadCVFixture('extended-cv');
    await inputCVContent(page, extendedCV);
    await waitForCVPreviewToLoad(page);
    
    const previewContent = await extractPreviewContent(page);
    
    // Extended CV should have substantial content
    expect(previewContent.fullText.length).toBeGreaterThan(1000);
    expect(previewContent.name).toContain('Alexandra Johnson');
    expect(previewContent.title).toContain('Architect');
    expect(previewContent.contactInfo.email).toContain('alexandra.johnson@email.com');
    
    // Should contain multiple experience entries
    expect(previewContent.fullText).toContain('CloudTech Solutions');
    expect(previewContent.fullText).toContain('DataCorp International');
    expect(previewContent.fullText).toContain('StartupInnovate');
    
    // Should contain education
    expect(previewContent.fullText).toContain('Ph.D. Computer Science');
    expect(previewContent.fullText).toContain('MIT');
    
    console.log('✅ Extended CV preview verification passed');
    console.log(`Extended CV contains ${previewContent.fullText.length} characters`);
  });

  test('Minimal CV content displays correctly', async ({ page }) => {
    const minimalCV = await loadCVFixture('minimal-cv');
    await inputCVContent(page, minimalCV);
    await waitForCVPreviewToLoad(page);
    
    const previewContent = await extractPreviewContent(page);
    
    // Even minimal content should be properly displayed
    expect(previewContent.fullText.length).toBeGreaterThan(50);
    expect(previewContent.name).toContain('John Doe');
    expect(previewContent.title).toContain('Software Developer');
    expect(previewContent.contactInfo.email).toContain('john.doe@email.com');
    
    // Should contain basic sections
    expect(previewContent.fullText).toContain('Experience');
    expect(previewContent.fullText).toContain('Skills');
    expect(previewContent.fullText).toContain('Education');
    
    console.log('✅ Minimal CV preview verification passed');
    console.log(`Minimal CV contains ${previewContent.fullText.length} characters`);
  });

  test('Contact information is properly formatted', async ({ page }) => {
    const cvContent = await loadCVFixture('sample-cv');
    await inputCVContent(page, cvContent);
    await waitForCVPreviewToLoad(page);
    
    const previewContent = await extractPreviewContent(page);
    
    // Verify contact information is extracted correctly
    expect(previewContent.contactInfo.email).toBe('jane.smith@email.com');
    expect(previewContent.contactInfo.phone).toMatch(/555-123-4567/);
    expect(previewContent.contactInfo.linkedin).toMatch(/linkedin.*janesmith/i);
    expect(previewContent.contactInfo.location).toMatch(/New York.*NY/i);
    
    // Verify contact info appears in the full text
    expect(previewContent.fullText).toContain('jane.smith@email.com');
    expect(previewContent.fullText).toContain('+1-555-123-4567');
    expect(previewContent.fullText).toContain('LinkedIn');
    expect(previewContent.fullText).toContain('Portfolio');
    expect(previewContent.fullText).toContain('New York, NY');
    
    console.log('✅ Contact information verification passed');
    console.log('Email:', previewContent.contactInfo.email);
    console.log('Phone:', previewContent.contactInfo.phone);
    console.log('Location:', previewContent.contactInfo.location);
  });

  test('CV editing updates preview in real-time', async ({ page }) => {
    // Start with sample CV
    const cvContent = await loadCVFixture('sample-cv');
    await inputCVContent(page, cvContent);
    await waitForCVPreviewToLoad(page);
    
    const initialContent = await extractPreviewContent(page);
    expect(initialContent.name).toContain('Jane Smith');
    
    // Modify the name in the editor
    const modifiedCV = cvContent.replace('Jane Smith', 'John Smith');
    await inputCVContent(page, modifiedCV);
    await waitForCVPreviewToLoad(page);
    
    const updatedContent = await extractPreviewContent(page);
    expect(updatedContent.name).toContain('John Smith');
    expect(updatedContent.name).not.toContain('Jane Smith');
    
    console.log('✅ Real-time preview update verification passed');
    console.log('Initial name:', initialContent.name);
    console.log('Updated name:', updatedContent.name);
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Take screenshot on failure for debugging
    if (testInfo.status !== 'passed') {
      await takeDebugScreenshot(page, testInfo.title.replace(/\s+/g, '-'));
    }
  });
});
