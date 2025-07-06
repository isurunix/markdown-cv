import { expect, test } from '@playwright/test';
import {
    compareContent,
    generateComparisonReport
} from '../utils/content-matcher';
import {
    extractPreviewContent,
    waitForCVPreviewToLoad
} from '../utils/cv-content-extractor';
import { extractPDFContent } from '../utils/pdf-text-extractor';
import {
    generateTestPDF,
    inputCVContent,
    loadCVFixture,
    takeDebugScreenshot,
    validateExportSuccess,
    waitForAppReady
} from '../utils/test-helpers';

test.describe('CV Content Fidelity Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
  });

  test('Sample CV content matches between preview and PDF', async ({ page }) => {
    // Load the sample CV content
    const cvContent = await loadCVFixture('sample-cv');
    
    // Input CV content into editor
    await inputCVContent(page, cvContent);
    
    // Wait for preview to update
    await waitForCVPreviewToLoad(page);
    
    // Extract content from preview
    const previewContent = await extractPreviewContent(page);
    
    // Debug: Log preview content
    console.log('Preview Content Debug:');
    console.log('Name:', previewContent.name);
    console.log('Title:', previewContent.title);
    console.log('Email:', previewContent.contactInfo.email);
    console.log('Full text length:', previewContent.fullText.length);
    console.log('Full text preview:', previewContent.fullText.substring(0, 200) + '...');
    
    // Verify preview has substantial content
    expect(previewContent.fullText.length).toBeGreaterThan(100);
    expect(previewContent.name).toBeTruthy();
    expect(previewContent.contactInfo.email).toBeTruthy();
    
    // Export PDF (Standard format)
    const pdfBuffer = await generateTestPDF(page, 'standard');
    validateExportSuccess(pdfBuffer);
    
    // Extract content from PDF
    const pdfContent = await extractPDFContent(pdfBuffer);
    
    // Debug: Log PDF content
    console.log('PDF Content Debug:');
    console.log('Name:', pdfContent.name);
    console.log('Title:', pdfContent.title);
    console.log('Email:', pdfContent.contactInfo.email);
    console.log('Full text length:', pdfContent.fullText.length);
    console.log('Full text preview:', pdfContent.fullText.substring(0, 200) + '...');
    
    // Compare content
    const comparison = compareContent(previewContent, pdfContent);
    
    // Generate detailed report for debugging
    const report = generateComparisonReport(comparison);
    console.log('Content Comparison Report:\n', report);
    
    // More lenient assertions for debugging
    if (pdfContent.fullText.length === 0) {
      throw new Error('PDF content extraction failed - no text found in PDF');
    }
    
    if (previewContent.fullText.length === 0) {
      throw new Error('Preview content extraction failed - no text found in preview');
    }
    
    // Assertions
    expect(comparison.nameMatch).toBe(true);
    expect(comparison.contactMatch.emailMatch).toBe(true);
    expect(comparison.overallSimilarity).toBeGreaterThan(0.85);
    expect(comparison.isAcceptable).toBe(true);
    
    // Additional specific checks for CV elements
    expect(previewContent.name).toContain('Jane Smith');
    expect(previewContent.title).toContain('UX Designer');
    expect(previewContent.contactInfo.email).toContain('jane.smith@email.com');
    
    // Verify key sections exist
    const keySections = ['Professional Summary', 'Experience', 'Skills', 'Education'];
    keySections.forEach(section => {
      expect(comparison.sectionsMatch[section]?.isAcceptable).toBe(true);
    });
  });

  test('ATS PDF format maintains content fidelity', async ({ page }) => {
    const cvContent = await loadCVFixture('sample-cv');
    await inputCVContent(page, cvContent);
    await waitForCVPreviewToLoad(page);
    
    const previewContent = await extractPreviewContent(page);
    
    // Export ATS format PDF
    const atsPdfBuffer = await generateTestPDF(page, 'ats');
    validateExportSuccess(atsPdfBuffer);
    
    const atsPdfContent = await extractPDFContent(atsPdfBuffer);
    const atsComparison = compareContent(previewContent, atsPdfContent);
    
    // ATS format should maintain the same content accuracy
    expect(atsComparison.nameMatch).toBe(true);
    expect(atsComparison.contactMatch.emailMatch).toBe(true);
    expect(atsComparison.overallSimilarity).toBeGreaterThan(0.80); // Slightly lower threshold for ATS
    expect(atsComparison.isAcceptable).toBe(true);
    
    console.log('ATS Format Comparison:\n', generateComparisonReport(atsComparison));
  });

  test('Extended CV handles multi-page content correctly', async ({ page }) => {
    const extendedCV = await loadCVFixture('extended-cv');
    await inputCVContent(page, extendedCV);
    await waitForCVPreviewToLoad(page);
    
    const previewContent = await extractPreviewContent(page);
    const pdfBuffer = await generateTestPDF(page, 'standard');
    
    validateExportSuccess(pdfBuffer);
    
    const pdfContent = await extractPDFContent(pdfBuffer);
    
    // Multi-page CV should have multiple pages
    expect(pdfContent.pageCount).toBeGreaterThan(1);
    
    // Content should still match well despite being longer
    const comparison = compareContent(previewContent, pdfContent);
    expect(comparison.overallSimilarity).toBeGreaterThan(0.80);
    expect(comparison.nameMatch).toBe(true);
    expect(comparison.contactMatch.emailMatch).toBe(true);
    
    // Should contain extensive content
    expect(previewContent.fullText.length).toBeGreaterThan(1000);
    expect(pdfContent.fullText.length).toBeGreaterThan(1000);
    
    console.log(`Multi-page CV: ${pdfContent.pageCount} pages`);
    console.log('Extended CV Comparison:\n', generateComparisonReport(comparison));
  });

  test('Minimal CV maintains content integrity', async ({ page }) => {
    const minimalCV = await loadCVFixture('minimal-cv');
    await inputCVContent(page, minimalCV);
    await waitForCVPreviewToLoad(page);
    
    const previewContent = await extractPreviewContent(page);
    const pdfBuffer = await generateTestPDF(page, 'standard');
    
    validateExportSuccess(pdfBuffer);
    
    const pdfContent = await extractPDFContent(pdfBuffer);
    const comparison = compareContent(previewContent, pdfContent);
    
    // Even minimal content should be preserved accurately
    expect(comparison.nameMatch).toBe(true);
    expect(comparison.contactMatch.emailMatch).toBe(true);
    expect(comparison.overallSimilarity).toBeGreaterThan(0.85);
    
    // Verify the minimal content elements
    expect(previewContent.name).toContain('John Doe');
    expect(previewContent.contactInfo.email).toContain('john.doe@email.com');
    
    console.log('Minimal CV Comparison:\n', generateComparisonReport(comparison));
  });

  test('Critical contact information is always preserved', async ({ page }) => {
    const cvContent = await loadCVFixture('sample-cv');
    await inputCVContent(page, cvContent);
    await waitForCVPreviewToLoad(page);
    
    const previewContent = await extractPreviewContent(page);
    const pdfBuffer = await generateTestPDF(page, 'standard');
    const pdfContent = await extractPDFContent(pdfBuffer);
    
    // Critical contact information must be 100% preserved
    const contactComparison = compareContent(previewContent, pdfContent).contactMatch;
    
    expect(contactComparison.emailMatch).toBe(true);
    expect(contactComparison.phoneMatch).toBe(true);
    expect(contactComparison.overallMatch).toBe(true);
    
    // Verify specific contact details
    expect(pdfContent.contactInfo.email).toContain('jane.smith@email.com');
    expect(pdfContent.contactInfo.phone).toMatch(/555-123-4567/);
    expect(pdfContent.contactInfo.linkedin).toMatch(/linkedin.*janesmith/i);
  });

  test('Experience section details are maintained', async ({ page }) => {
    const cvContent = await loadCVFixture('sample-cv');
    await inputCVContent(page, cvContent);
    await waitForCVPreviewToLoad(page);
    
    const previewContent = await extractPreviewContent(page);
    const pdfBuffer = await generateTestPDF(page, 'standard');
    const pdfContent = await extractPDFContent(pdfBuffer);
    
    const comparison = compareContent(previewContent, pdfContent);
    
    // Experience section is critical for CVs
    const experienceComparison = comparison.sectionsMatch['Experience'];
    expect(experienceComparison).toBeDefined();
    expect(experienceComparison.isAcceptable).toBe(true);
    expect(experienceComparison.similarity).toBeGreaterThan(0.80);
    
    // Verify key experience details are present
    const experienceText = pdfContent.sections['Experience'] || pdfContent.fullText;
    expect(experienceText).toMatch(/DesignCorp/i);
    expect(experienceText).toMatch(/UX Designer/i);
    expect(experienceText).toMatch(/Mar 2021|2021/i);
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Take screenshot on failure for debugging
    if (testInfo.status !== 'passed') {
      await takeDebugScreenshot(page, testInfo.title.replace(/\s+/g, '-'));
    }
  });
});
