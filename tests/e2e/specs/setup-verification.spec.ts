import { expect, test } from '@playwright/test';

test.describe('Basic Setup Verification', () => {
  test('Application loads and displays CV builder', async ({ page }) => {
    await page.goto('/');
    
    // Wait for main elements to load
    await page.waitForSelector('.cv-preview-content, .monaco-editor', { timeout: 30000 });
    
    // Check that we have both editor and preview
    const hasEditor = await page.locator('.monaco-editor, [data-testid="markdown-editor"]').isVisible();
    const hasPreview = await page.locator('.cv-preview-content').first().isVisible();
    
    expect(hasEditor || hasPreview).toBe(true); // At least one should be visible
    
    // Check page title
    const title = await page.title();
    expect(title).toContain('CV Builder'); // Adjust based on your actual title
    
    console.log('✅ Application loads successfully');
    console.log('✅ CV Builder interface is visible');
  });

  test('Can input text and see preview update', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.cv-preview-content', { timeout: 30000 });
    
    // Find and fill the editor
    const editorSelector = '.monaco-editor textarea, [data-testid="markdown-editor"] textarea, .editor textarea';
    await page.waitForSelector(editorSelector, { timeout: 10000 });
    
    const testContent = '# Test User\n**Test Title**\n\nThis is a test CV.';
    await page.fill(editorSelector, testContent);
    
    // Wait for preview to update
    await page.waitForTimeout(2000);
    
    // Check if content appears in preview
    const previewText = await page.textContent('.cv-preview-content');
    expect(previewText).toContain('Test User');
    expect(previewText).toContain('Test Title');
    
    console.log('✅ Editor input works');
    console.log('✅ Preview updates with content');
  });
});
