# End-to-End Testing Strategy

## 📋 Overview

This document outlines the E2E testing strategy for the Markdown CV Builder, focusing on **content fidelity verification** between the preview display and generated PDF exports.

## 🎯 Core Objective

**Ensure that whatever content is shown in the CV preview is accurately represented in the downloaded PDF**, maintaining the integrity of CV information across different formats and templates.

## 🔍 Test Scope

### In Scope
- ✅ **Core CV Elements**: Name, title, contact info, experience, skills, education
- ✅ **Content Preservation**: Text accuracy between preview and PDF
- ✅ **Template Consistency**: Content identical across Single/Two Column layouts
- ✅ **Page Format Support**: A4 and US Letter format handling
- ✅ **Multi-page CVs**: Proper page breaks and content flow
- ✅ **Export Formats**: Both Standard and ATS PDF generation

### Out of Scope
- ❌ Complex markdown features (tables, code blocks, advanced formatting)
- ❌ Sub-heading levels (H4, H5, H6) - CVs typically use H1-H3
- ❌ Visual layout pixel-perfect comparison
- ❌ Performance benchmarking (separate concern)

## 🧪 Test Scenarios

### Scenario A: Basic CV Content Fidelity
**Purpose**: Verify core CV elements are preserved from preview to PDF
**Test Data**: `sample-cv.md` (Jane Smith CV)
**Verification Points**:
- Name and title appear correctly
- All contact information preserved (email, phone, LinkedIn, location)
- Professional summary text matches
- Work experience entries complete (company, dates, descriptions)
- Skills lists maintain structure and content
- Education details accurate

### Scenario B: Template Consistency
**Purpose**: Ensure content remains identical across layout templates
**Test Steps**:
1. Load sample CV content
2. Export PDF from Single Column template
3. Switch to Two Column template
4. Export PDF from Two Column template
5. Compare extracted text content (should be 100% identical)

### Scenario C: Page Format Consistency
**Purpose**: Verify content preservation across page formats
**Test Steps**:
1. Load sample CV in US Letter format
2. Export PDF
3. Switch to A4 format
4. Export PDF
5. Compare content (layout may differ, content must be identical)

### Scenario D: Multi-page CV Handling
**Purpose**: Test proper handling of CVs spanning multiple pages
**Test Data**: Extended CV with multiple jobs and education entries
**Verification Points**:
- Page breaks don't cut off mid-sentence
- All sections appear in final PDF
- Page count matches preview indication
- Content flows logically across pages

### Scenario E: Contact Information Integrity
**Purpose**: Critical verification of contact details (most important CV data)
**Verification Points**:
- Email addresses preserved and properly formatted
- Phone numbers maintain formatting
- LinkedIn/portfolio URLs are complete
- Location information accurate

## 🛠 Technical Implementation

### Testing Framework
**Playwright** - chosen for:
- Superior PDF download handling
- Cross-browser testing capability
- Built-in file system operations
- Better control over headless operations

### Project Structure
```
tests/
├── e2e/
│   ├── fixtures/
│   │   ├── sample-cv.md          # Jane Smith CV from examples
│   │   ├── extended-cv.md        # Multi-page test CV
│   │   └── minimal-cv.md         # Edge case testing
│   ├── utils/
│   │   ├── cv-content-extractor.ts   # Extract content from preview DOM
│   │   ├── pdf-text-extractor.ts     # Extract text from PDF files
│   │   ├── content-matcher.ts        # CV-specific content comparison
│   │   └── test-helpers.ts           # Common utilities
│   └── specs/
│       ├── cv-content-fidelity.spec.ts    # Main content verification tests
│       ├── template-consistency.spec.ts    # Template switching tests
│       └── page-format-handling.spec.ts   # A4 vs US Letter tests
├── playwright.config.ts
└── package.json (updated with test scripts)
```

### Content Extraction Strategy

#### Preview Content Extraction
```typescript
// Extract structured content from preview DOM
const extractPreviewContent = async (page: Page) => {
  return await page.evaluate(() => {
    const previewElement = document.querySelector('.cv-preview-content');
    return {
      name: previewElement.querySelector('h1')?.textContent?.trim(),
      title: previewElement.querySelector('h1 + p strong')?.textContent?.trim(),
      contactInfo: extractContactSection(previewElement),
      sections: extractCVSections(previewElement),
      fullText: previewElement.textContent?.replace(/\s+/g, ' ').trim()
    };
  });
};
```

#### PDF Content Extraction
```typescript
// Extract and normalize text from PDF
const extractPDFContent = async (pdfBuffer: Buffer) => {
  const pdfData = await pdfParse(pdfBuffer);
  const normalizedText = pdfData.text
    .replace(/\s+/g, ' ')
    .trim();
  
  return {
    fullText: normalizedText,
    sections: parseCVSections(normalizedText),
    pageCount: pdfData.numpages
  };
};
```

#### Content Comparison Logic
```typescript
const compareContent = (preview: CVContent, pdf: CVContent) => {
  return {
    nameMatch: fuzzyMatch(preview.name, pdf.name, 0.95),
    contactMatch: compareContactInfo(preview.contactInfo, pdf.contactInfo),
    sectionsMatch: compareSections(preview.sections, pdf.sections),
    overallSimilarity: calculateTextSimilarity(preview.fullText, pdf.fullText)
  };
};
```

## 📊 Success Criteria

### Content Accuracy Thresholds
- **Name and Title**: 100% exact match
- **Contact Information**: 100% preservation of all details
- **Section Content**: 95% text similarity (allowing for minor formatting differences)
- **Overall Content**: 90% text similarity between preview and PDF

### Template Consistency
- **Cross-template Content**: 100% identical text content across templates
- **Page Format Content**: 100% identical text content across A4/US Letter

### Performance Expectations
- **PDF Generation**: Complete within 10 seconds
- **Test Execution**: Full suite completes within 5 minutes
- **Reliability**: 99%+ test pass rate in CI/CD

## 🚀 Implementation Plan

### Phase 1: Setup & Infrastructure
1. Install and configure Playwright
2. Create project structure and utilities
3. Set up test fixtures and sample data

### Phase 2: Core Test Implementation
1. Implement content extraction utilities
2. Create main content fidelity tests
3. Add template consistency verification

### Phase 3: Edge Cases & Validation
1. Multi-page CV handling
2. Page format switching tests
3. Error handling and edge cases

### Phase 4: CI/CD Integration
1. Configure test execution in CI pipeline
2. Set up test reporting and artifacts
3. Establish test maintenance procedures

## 🔧 Maintenance & Updates

### When to Update Tests
- **New CV templates added**: Verify content consistency
- **PDF generation changes**: Re-validate output accuracy
- **UI/UX updates**: Ensure selectors remain valid
- **Sample CV updates**: Update test fixtures accordingly

### Monitoring & Alerts
- **Failed tests**: Immediate notification on content mismatches
- **Performance degradation**: Alert if PDF generation exceeds thresholds
- **Regular audits**: Monthly review of test coverage and accuracy

## 📝 Notes

This testing strategy focuses specifically on CV-relevant content verification, avoiding over-engineering while ensuring the core value proposition (accurate PDF generation) is thoroughly validated.

The approach prioritizes practical CV use cases over comprehensive markdown feature testing, making it efficient and maintainable for a CV builder application.
