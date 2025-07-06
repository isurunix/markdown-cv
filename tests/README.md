# E2E Testing Guide

## Overview

This directory contains end-to-end tests for the Markdown CV Builder, focusing on **content fidelity verification** between the preview display and generated PDF exports.

## Test Strategy

Our E2E tests ensure that:
1. **Content shown in preview matches what's in the PDF** - Core content fidelity
2. **Templates preserve identical content** - Single vs Two Column consistency  
3. **Page formats maintain content** - A4 vs US Letter preservation
4. **Critical CV elements are accurate** - Contact info, experience, skills, etc.

## Test Structure

```
tests/e2e/
├── fixtures/          # Test CV data
│   ├── sample-cv.md       # Jane Smith UX Designer CV
│   ├── extended-cv.md     # Multi-page Alexandra Johnson CV  
│   └── minimal-cv.md      # Simple John Doe CV
├── utils/             # Testing utilities
│   ├── cv-content-extractor.ts   # Extract content from preview DOM
│   ├── pdf-text-extractor.ts     # Extract text from PDF files
│   ├── content-matcher.ts        # Compare preview vs PDF content
│   └── test-helpers.ts           # Common test utilities
└── specs/             # Test suites
    ├── cv-content-fidelity.spec.ts    # Main content verification
    ├── template-consistency.spec.ts    # Template switching tests
    └── page-format-handling.spec.ts   # A4 vs US Letter tests
```

## Prerequisites

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npm run test:install
   ```

3. **Ensure the app can start:**
   ```bash
   npm run dev
   ```

## Running Tests

### Full Test Suite
```bash
npm run test:e2e
```

### Interactive UI Mode
```bash
npm run test:e2e:ui
```

### Headed Mode (see browser)
```bash
npm run test:e2e:headed
```

### Specific Test File
```bash
npx playwright test cv-content-fidelity.spec.ts
```

### Specific Test
```bash
npx playwright test -g "Sample CV content matches"
```

## Test Coverage

### Content Fidelity Tests (`cv-content-fidelity.spec.ts`)
- ✅ Sample CV content matches between preview and PDF
- ✅ ATS PDF format maintains content fidelity
- ✅ Extended CV handles multi-page content correctly
- ✅ Minimal CV maintains content integrity
- ✅ Critical contact information is always preserved
- ✅ Experience section details are maintained

### Template Consistency Tests (`template-consistency.spec.ts`)
- ✅ Content identical across Single Column and Two Column templates
- ✅ Template switching preserves preview content
- ✅ Both templates handle extended CV consistently
- ✅ Template switching works with minimal CV
- ✅ Both ATS and Standard formats work across templates

### Page Format Tests (`page-format-handling.spec.ts`)
- ✅ Content identical between A4 and US Letter formats
- ✅ Extended CV page count may differ between formats
- ✅ Page format switching preserves preview content
- ✅ Both formats work with both export types
- ✅ Minimal CV works consistently across formats

## Success Criteria

### Content Accuracy
- **Name and Title**: 100% exact match
- **Contact Information**: 100% preservation of all details
- **Section Content**: 95% text similarity (allowing for minor formatting differences)
- **Overall Content**: 85% text similarity between preview and PDF

### Template Consistency
- **Cross-template Content**: 95%+ identical text content across templates
- **Page Format Content**: 95%+ identical text content across A4/US Letter

### Performance
- **PDF Generation**: Complete within 10 seconds
- **Test Execution**: Full suite completes within 5 minutes

## Debugging Failed Tests

### View Test Reports
```bash
npx playwright show-report
```

### Debug Mode
```bash
npx playwright test --debug
```

### Screenshots and Videos
Failed tests automatically capture:
- Screenshots in `test-results/`
- Videos (if enabled)
- Debug screenshots with `takeDebugScreenshot()`

### Common Issues

1. **App not starting**: Ensure `npm run dev` works
2. **Export button not found**: Check if UI selectors changed
3. **PDF extraction fails**: Verify PDF generation is working
4. **Content mismatch**: Check `generateComparisonReport()` output

## Updating Tests

### When to Update
- **New CV templates added**: Add template consistency tests
- **PDF generation changes**: Re-validate extraction logic
- **UI changes**: Update selectors in test helpers
- **Sample CV updates**: Update fixtures accordingly

### Adding New Test Cases
1. Create fixture in `fixtures/` if needed
2. Add test to appropriate spec file
3. Use existing utilities for content extraction and comparison
4. Follow naming convention: `describe what it tests`

## CI/CD Integration

Tests are configured to run in CI with:
- Headless mode
- Retry on failure (2 retries)
- Artifact collection (screenshots, videos, reports)
- JUnit XML reporting

## Notes

- Tests focus on CV-specific content rather than general markdown features
- Image content is verified by placeholder presence, not actual image rendering
- Tests use realistic CV samples to ensure practical relevance
- Content comparison allows for minor formatting differences while ensuring accuracy
