import { expect, test } from '@playwright/test';
import { compareContent } from '../utils/content-matcher';
import { extractPreviewContent, waitForCVPreviewToLoad } from '../utils/cv-content-extractor';
import { extractPDFContent } from '../utils/pdf-text-extractor';
import { generateTestPDF, waitForAppReady } from '../utils/test-helpers';

test.describe('Basic PDF Generation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
  });

  test('PDF generation works with default content', async ({ page }) => {
    // Wait for the preview to load with default content
    await waitForCVPreviewToLoad(page);
    
    // Extract preview content (should be John Doe default content)
    const previewContent = await extractPreviewContent(page);
    console.log('Preview content name:', previewContent.name);
    console.log('Preview content email:', previewContent.contactInfo.email);
    
    // Generate PDF using our test helper
    const pdfBuffer = await generateTestPDF(page, 'standard', 'US Letter');
    
    // Validate PDF is generated
    expect(pdfBuffer.length).toBeGreaterThan(10000); // Should be substantial size
    
    // Extract PDF content
    const pdfContent = await extractPDFContent(pdfBuffer);
    console.log('PDF content name:', pdfContent.name);
    console.log('PDF content email:', pdfContent.contactInfo.email);
    
    // Compare preview and PDF content
    const comparison = compareContent(previewContent, pdfContent);
    
    // Basic validations
    expect(previewContent.name).toBeTruthy();
    expect(pdfContent.name).toBeTruthy();
    expect(previewContent.contactInfo.email).toBeTruthy();
    expect(pdfContent.contactInfo.email).toBeTruthy();
    
    // Should have reasonable similarity
    expect(comparison.overallSimilarity).toBeGreaterThan(0.5);
    
    console.log('✅ Basic PDF generation test passed');
    console.log(`Overall similarity: ${(comparison.overallSimilarity * 100).toFixed(1)}%`);
  });

  test('ATS PDF format works', async ({ page }) => {
    // Wait for the preview to load with default content
    await waitForCVPreviewToLoad(page);
    
    // Generate ATS PDF
    const atsPdfBuffer = await generateTestPDF(page, 'ats', 'US Letter');
    
    // Validate PDF is generated
    expect(atsPdfBuffer.length).toBeGreaterThan(10000);
    
    // Extract PDF content
    const pdfContent = await extractPDFContent(atsPdfBuffer);
    
    // Basic validations
    expect(pdfContent.name).toBeTruthy();
    expect(pdfContent.contactInfo.email).toBeTruthy();
    expect(pdfContent.fullText.length).toBeGreaterThan(100);
    
    console.log('✅ ATS PDF generation test passed');
  });
});
