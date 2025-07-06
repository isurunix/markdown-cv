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
    inputCVContent,
    loadCVFixture,
    switchTemplate,
    validateExportSuccess,
    waitForAppReady
} from '../utils/test-helpers';

test.describe('Template Consistency Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForAppReady(page);
  });

  test('Content remains identical across Classic Professional and Modern Minimalist templates', async ({ page }) => {
    const cvContent = await loadCVFixture('sample-cv');
    await inputCVContent(page, cvContent);
    await waitForCVPreviewToLoad(page);
    
    // Test Classic Professional template first
    await switchTemplate(page, 'Classic Professional');
    await waitForCVPreviewToLoad(page);
    
    const classicPreview = await extractPreviewContent(page);
    const classicPDF = await exportPDF(page, 'standard');
    validateExportSuccess(classicPDF);
    
    const classicPDFContent = await extractPDFContent(classicPDF);
    
    // Switch to Modern Minimalist template
    await switchTemplate(page, 'Modern Minimalist');
    await waitForCVPreviewToLoad(page);
    
    const modernPreview = await extractPreviewContent(page);
    const modernPDF = await exportPDF(page, 'standard');
    validateExportSuccess(modernPDF);
    
    const modernPDFContent = await extractPDFContent(modernPDF);
    
    // Compare content between templates - should be identical
    const templateComparison = compareContent(classicPDFContent, modernPDFContent);
    
    // Content should be virtually identical across templates
    expect(templateComparison.nameMatch).toBe(true);
    expect(templateComparison.contactMatch.emailMatch).toBe(true);
    expect(templateComparison.contactMatch.phoneMatch).toBe(true);
    expect(templateComparison.overallSimilarity).toBeGreaterThan(0.95); // Very high threshold for template consistency
    
    // All major sections should be preserved
    const criticalSections = ['Professional Summary', 'Experience', 'Skills', 'Education'];
    criticalSections.forEach(section => {
      if (templateComparison.sectionsMatch[section]) {
        expect(templateComparison.sectionsMatch[section].similarity).toBeGreaterThan(0.90);
      }
    });
    
    console.log('Template Consistency Report:\n', generateComparisonReport(templateComparison));
    
    // Verify that both templates produced valid PDFs with content
    expect(classicPDFContent.fullText.length).toBeGreaterThan(100);
    expect(modernPDFContent.fullText.length).toBeGreaterThan(100);
    expect(classicPDFContent.name).toBeTruthy();
    expect(modernPDFContent.name).toBeTruthy();
  });

  test('Template switching preserves preview content', async ({ page }) => {
    const cvContent = await loadCVFixture('sample-cv');
    await inputCVContent(page, cvContent);
    await waitForCVPreviewToLoad(page);
    
    // Get initial preview content
    const initialPreview = await extractPreviewContent(page);
    
    // Switch templates multiple times
    await switchTemplate(page, 'two-column');
    await waitForCVPreviewToLoad(page);
    const twoColumnPreview = await extractPreviewContent(page);
    
    await switchTemplate(page, 'single-column');
    await waitForCVPreviewToLoad(page);
    const backToSinglePreview = await extractPreviewContent(page);
    
    // Content should remain consistent across template switches
    expect(initialPreview.name).toBe(backToSinglePreview.name);
    expect(initialPreview.contactInfo.email).toBe(backToSinglePreview.contactInfo.email);
    expect(initialPreview.contactInfo.phone).toBe(backToSinglePreview.contactInfo.phone);
    
    // Two column should also have the same core content
    expect(twoColumnPreview.name).toBe(initialPreview.name);
    expect(twoColumnPreview.contactInfo.email).toBe(initialPreview.contactInfo.email);
    
    // Text similarity should be very high (allowing for minor formatting differences)
    const similarity1 = compareContent(initialPreview, twoColumnPreview).overallSimilarity;
    const similarity2 = compareContent(initialPreview, backToSinglePreview).overallSimilarity;
    
    expect(similarity1).toBeGreaterThan(0.90);
    expect(similarity2).toBeGreaterThan(0.95); // Should be nearly identical
  });

  test('Both templates handle extended CV consistently', async ({ page }) => {
    const extendedCV = await loadCVFixture('extended-cv');
    await inputCVContent(page, extendedCV);
    await waitForCVPreviewToLoad(page);
    
    // Test with Single Column
    await switchTemplate(page, 'single-column');
    await waitForCVPreviewToLoad(page);
    const singleColumnPDF = await exportPDF(page, 'standard');
    const singleColumnContent = await extractPDFContent(singleColumnPDF);
    
    // Test with Two Column
    await switchTemplate(page, 'two-column');
    await waitForCVPreviewToLoad(page);
    const twoColumnPDF = await exportPDF(page, 'standard');
    const twoColumnContent = await extractPDFContent(twoColumnPDF);
    
    // Both should handle the extended content well
    expect(singleColumnContent.fullText.length).toBeGreaterThan(1000);
    expect(twoColumnContent.fullText.length).toBeGreaterThan(1000);
    
    // Core content should be preserved in both
    const comparison = compareContent(singleColumnContent, twoColumnContent);
    expect(comparison.nameMatch).toBe(true);
    expect(comparison.contactMatch.emailMatch).toBe(true);
    expect(comparison.overallSimilarity).toBeGreaterThan(0.85);
    
    // Verify key person details are consistent
    expect(singleColumnContent.name).toContain('Alexandra Johnson');
    expect(twoColumnContent.name).toContain('Alexandra Johnson');
    expect(singleColumnContent.contactInfo.email).toContain('alexandra.johnson@email.com');
    expect(twoColumnContent.contactInfo.email).toContain('alexandra.johnson@email.com');
    
    console.log(`Single Column Pages: ${singleColumnContent.pageCount}`);
    console.log(`Two Column Pages: ${twoColumnContent.pageCount}`);
    console.log('Extended CV Template Comparison:\n', generateComparisonReport(comparison));
  });

  test('Template switching works with minimal CV', async ({ page }) => {
    const minimalCV = await loadCVFixture('minimal-cv');
    await inputCVContent(page, minimalCV);
    await waitForCVPreviewToLoad(page);
    
    // Single Column
    await switchTemplate(page, 'single-column');
    await waitForCVPreviewToLoad(page);
    const singlePDF = await exportPDF(page, 'standard');
    const singleContent = await extractPDFContent(singlePDF);
    
    // Two Column
    await switchTemplate(page, 'two-column');
    await waitForCVPreviewToLoad(page);
    const twoPDF = await exportPDF(page, 'standard');
    const twoContent = await extractPDFContent(twoPDF);
    
    // Even minimal content should be handled consistently
    const comparison = compareContent(singleContent, twoContent);
    expect(comparison.nameMatch).toBe(true);
    expect(comparison.contactMatch.emailMatch).toBe(true);
    expect(comparison.overallSimilarity).toBeGreaterThan(0.90);
    
    // Verify core minimal elements
    expect(singleContent.name).toContain('John Doe');
    expect(twoContent.name).toContain('John Doe');
    expect(singleContent.title).toContain('Software Developer');
    expect(twoContent.title).toContain('Software Developer');
  });

  test('Both ATS and Standard formats work across templates', async ({ page }) => {
    const cvContent = await loadCVFixture('sample-cv');
    await inputCVContent(page, cvContent);
    await waitForCVPreviewToLoad(page);
    
    // Single Column - both formats
    await switchTemplate(page, 'single-column');
    await waitForCVPreviewToLoad(page);
    
    const singleStandardPDF = await exportPDF(page, 'standard');
    const singleATSPDF = await exportPDF(page, 'ats');
    
    const singleStandardContent = await extractPDFContent(singleStandardPDF);
    const singleATSContent = await extractPDFContent(singleATSPDF);
    
    // Two Column - both formats
    await switchTemplate(page, 'two-column');
    await waitForCVPreviewToLoad(page);
    
    const twoStandardPDF = await exportPDF(page, 'standard');
    const twoATSPDF = await exportPDF(page, 'ats');
    
    const twoStandardContent = await extractPDFContent(twoStandardPDF);
    const twoATSContent = await extractPDFContent(twoATSPDF);
    
    // All combinations should preserve core content
    const comparisons = [
      compareContent(singleStandardContent, singleATSContent),
      compareContent(twoStandardContent, twoATSContent),
      compareContent(singleStandardContent, twoStandardContent),
      compareContent(singleATSContent, twoATSContent)
    ];
    
    comparisons.forEach((comparison, index) => {
      const labels = [
        'Single: Standard vs ATS',
        'Two: Standard vs ATS', 
        'Standard: Single vs Two',
        'ATS: Single vs Two'
      ];
      
      expect(comparison.nameMatch).toBe(true);
      expect(comparison.contactMatch.emailMatch).toBe(true);
      expect(comparison.overallSimilarity).toBeGreaterThan(0.80);
      
      console.log(`${labels[index]}:\n${generateComparisonReport(comparison)}\n`);
    });
  });
});
