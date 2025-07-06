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
    exportPDF,
    getPageCount,
    inputCVContent,
    loadCVFixture,
    switchPageFormat,
    validateExportSuccess,
    waitForAppReady
} from '../utils/test-helpers';

test.describe('Page Format Handling Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
  });

  test('Content remains identical between A4 and US Letter formats', async ({ page }) => {
    const cvContent = await loadCVFixture('sample-cv');
    await inputCVContent(page, cvContent);
    await waitForCVPreviewToLoad(page);
    
    // Test US Letter format first
    await switchPageFormat(page, 'US Letter');
    await waitForCVPreviewToLoad(page);
    
    const usLetterPDF = await exportPDF(page, 'standard');
    validateExportSuccess(usLetterPDF);
    const usLetterContent = await extractPDFContent(usLetterPDF);
    
    // Switch to A4 format
    await switchPageFormat(page, 'A4');
    await waitForCVPreviewToLoad(page);
    
    const a4PDF = await exportPDF(page, 'standard');
    validateExportSuccess(a4PDF);
    const a4Content = await extractPDFContent(a4PDF);
    
    // Content should be identical across page formats
    const formatComparison = compareContent(usLetterContent, a4Content);
    
    expect(formatComparison.nameMatch).toBe(true);
    expect(formatComparison.contactMatch.emailMatch).toBe(true);
    expect(formatComparison.contactMatch.phoneMatch).toBe(true);
    expect(formatComparison.overallSimilarity).toBeGreaterThan(0.95); // Very high threshold
    
    // All sections should be preserved
    const criticalSections = ['Professional Summary', 'Experience', 'Skills', 'Education'];
    criticalSections.forEach(section => {
      if (formatComparison.sectionsMatch[section]) {
        expect(formatComparison.sectionsMatch[section].similarity).toBeGreaterThan(0.90);
      }
    });
    
    console.log('Page Format Comparison Report:\n', generateComparisonReport(formatComparison));
    
    // Both formats should have valid content
    expect(usLetterContent.fullText.length).toBeGreaterThan(100);
    expect(a4Content.fullText.length).toBeGreaterThan(100);
    expect(usLetterContent.name).toContain('Jane Smith');
    expect(a4Content.name).toContain('Jane Smith');
  });

  test('Extended CV page count may differ between formats', async ({ page }) => {
    const extendedCV = await loadCVFixture('extended-cv');
    await inputCVContent(page, extendedCV);
    await waitForCVPreviewToLoad(page);
    
    // US Letter format
    await switchPageFormat(page, 'US Letter');
    await waitForCVPreviewToLoad(page);
    const usLetterPageCount = await getPageCount(page);
    const usLetterPDF = await exportPDF(page, 'standard');
    const usLetterContent = await extractPDFContent(usLetterPDF);
    
    // A4 format  
    await switchPageFormat(page, 'A4');
    await waitForCVPreviewToLoad(page);
    const a4PageCount = await getPageCount(page);
    const a4PDF = await exportPDF(page, 'standard');
    const a4Content = await extractPDFContent(a4PDF);
    
    // Page counts might differ due to different page dimensions
    console.log(`US Letter pages: ${usLetterPageCount}, A4 pages: ${a4PageCount}`);
    console.log(`US Letter PDF pages: ${usLetterContent.pageCount}, A4 PDF pages: ${a4Content.pageCount}`);
    
    // But content should still be the same
    const comparison = compareContent(usLetterContent, a4Content);
    expect(comparison.nameMatch).toBe(true);
    expect(comparison.contactMatch.emailMatch).toBe(true);
    expect(comparison.overallSimilarity).toBeGreaterThan(0.90);
    
    // Both should be multi-page
    expect(usLetterContent.pageCount).toBeGreaterThan(1);
    expect(a4Content.pageCount).toBeGreaterThan(1);
    
    // Verify extended CV specific content
    expect(usLetterContent.name).toContain('Alexandra Johnson');
    expect(a4Content.name).toContain('Alexandra Johnson');
    expect(usLetterContent.contactInfo.email).toContain('alexandra.johnson@email.com');
    expect(a4Content.contactInfo.email).toContain('alexandra.johnson@email.com');
  });

  test('Page format switching preserves preview content', async ({ page }) => {
    const cvContent = await loadCVFixture('sample-cv');
    await inputCVContent(page, cvContent);
    await waitForCVPreviewToLoad(page);
    
    // Get initial preview content
    const initialPreview = await extractPreviewContent(page);
    
    // Switch between formats multiple times
    await switchPageFormat(page, 'A4');
    await waitForCVPreviewToLoad(page);
    const a4Preview = await extractPreviewContent(page);
    
    await switchPageFormat(page, 'US Letter');
    await waitForCVPreviewToLoad(page);
    const backToUSLetterPreview = await extractPreviewContent(page);
    
    // Content should remain consistent across format switches
    expect(initialPreview.name).toBe(backToUSLetterPreview.name);
    expect(initialPreview.contactInfo.email).toBe(backToUSLetterPreview.contactInfo.email);
    expect(initialPreview.contactInfo.phone).toBe(backToUSLetterPreview.contactInfo.phone);
    
    // A4 format should also have the same core content
    expect(a4Preview.name).toBe(initialPreview.name);
    expect(a4Preview.contactInfo.email).toBe(initialPreview.contactInfo.email);
    
    // Text content should be virtually identical
    const similarity1 = compareContent(initialPreview, a4Preview).overallSimilarity;
    const similarity2 = compareContent(initialPreview, backToUSLetterPreview).overallSimilarity;
    
    expect(similarity1).toBeGreaterThan(0.95);
    expect(similarity2).toBeGreaterThan(0.98); // Should be nearly identical
  });

  test('Both formats work with both export types', async ({ page }) => {
    const cvContent = await loadCVFixture('sample-cv');
    await inputCVContent(page, cvContent);
    await waitForCVPreviewToLoad(page);
    
    // US Letter - both standard and ATS
    await switchPageFormat(page, 'US Letter');
    await waitForCVPreviewToLoad(page);
    
    const usLetterStandardPDF = await exportPDF(page, 'standard');
    const usLetterATSPDF = await exportPDF(page, 'ats');
    
    const usLetterStandardContent = await extractPDFContent(usLetterStandardPDF);
    const usLetterATSContent = await extractPDFContent(usLetterATSPDF);
    
    // A4 - both standard and ATS
    await switchPageFormat(page, 'A4');
    await waitForCVPreviewToLoad(page);
    
    const a4StandardPDF = await exportPDF(page, 'standard');
    const a4ATSPDF = await exportPDF(page, 'ats');
    
    const a4StandardContent = await extractPDFContent(a4StandardPDF);
    const a4ATSContent = await extractPDFContent(a4ATSPDF);
    
    // All combinations should work and preserve content
    const allContents = [
      usLetterStandardContent,
      usLetterATSContent,
      a4StandardContent,
      a4ATSContent
    ];
    
    // Each should have valid content
    allContents.forEach((content, index) => {
      const labels = ['US Letter Standard', 'US Letter ATS', 'A4 Standard', 'A4 ATS'];
      
      expect(content.fullText.length).toBeGreaterThan(100);
      expect(content.name).toContain('Jane Smith');
      expect(content.contactInfo.email).toContain('jane.smith@email.com');
      
      console.log(`${labels[index]}: ${content.fullText.length} characters, ${content.pageCount} pages`);
    });
    
    // Cross-format comparisons
    const standardFormatComparison = compareContent(usLetterStandardContent, a4StandardContent);
    const atsFormatComparison = compareContent(usLetterATSContent, a4ATSContent);
    
    expect(standardFormatComparison.overallSimilarity).toBeGreaterThan(0.95);
    expect(atsFormatComparison.overallSimilarity).toBeGreaterThan(0.90);
    
    console.log('Standard Format Cross-Comparison:\n', generateComparisonReport(standardFormatComparison));
    console.log('ATS Format Cross-Comparison:\n', generateComparisonReport(atsFormatComparison));
  });

  test('Minimal CV works consistently across formats', async ({ page }) => {
    const minimalCV = await loadCVFixture('minimal-cv');
    await inputCVContent(page, minimalCV);
    await waitForCVPreviewToLoad(page);
    
    // US Letter
    await switchPageFormat(page, 'US Letter');
    await waitForCVPreviewToLoad(page);
    const usLetterPDF = await exportPDF(page, 'standard');
    const usLetterContent = await extractPDFContent(usLetterPDF);
    
    // A4
    await switchPageFormat(page, 'A4');
    await waitForCVPreviewToLoad(page);
    const a4PDF = await exportPDF(page, 'standard');
    const a4Content = await extractPDFContent(a4PDF);
    
    // Minimal content should be identical across formats
    const comparison = compareContent(usLetterContent, a4Content);
    expect(comparison.nameMatch).toBe(true);
    expect(comparison.contactMatch.emailMatch).toBe(true);
    expect(comparison.overallSimilarity).toBeGreaterThan(0.95);
    
    // Both should be single page for minimal content
    expect(usLetterContent.pageCount).toBe(1);
    expect(a4Content.pageCount).toBe(1);
    
    // Verify minimal content elements
    expect(usLetterContent.name).toContain('John Doe');
    expect(a4Content.name).toContain('John Doe');
    expect(usLetterContent.title).toContain('Software Developer');
    expect(a4Content.title).toContain('Software Developer');
  });

  test('Page format indicator shows correct format', async ({ page }) => {
    const cvContent = await loadCVFixture('sample-cv');
    await inputCVContent(page, cvContent);
    await waitForCVPreviewToLoad(page);
    
    // Check US Letter is selected by default or can be selected
    await switchPageFormat(page, 'US Letter');
    
    // Look for format indicator in the UI
    const usLetterIndicator = await page.textContent('select option[value="US Letter"], .page-format-indicator');
    expect(usLetterIndicator).toMatch(/US Letter|8\.5.*11/i);
    
    // Switch to A4
    await switchPageFormat(page, 'A4');
    
    const a4Indicator = await page.textContent('select option[value="A4"], .page-format-indicator');
    expect(a4Indicator).toMatch(/A4|210.*297/i);
    
    // The UI should reflect the current selection
    const selectedFormat = await page.inputValue('select[data-testid="page-format"], select:has(option[value="A4"])');
    expect(selectedFormat).toBe('A4');
  });
});
