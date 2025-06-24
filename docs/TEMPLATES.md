# Template Guidelines

## 🎨 Template Design Philosophy

### Core Principles
1. **Professional First**: All templates prioritize professional appearance
2. **ATS Compatibility**: Ensure machine readability for applicant tracking systems
3. **Readability**: Clear hierarchy and scannable content
4. **Flexibility**: Work well with varying content lengths
5. **Print Optimization**: Look great both on screen and printed

### Design Constraints
- **Page Size**: Optimized for A4 and US Letter formats
- **Margins**: Minimum 0.5 inch margins for printing
- **Font Sizes**: 10-12pt for body text, 14-18pt for headings
- **Color Usage**: Professional color schemes, high contrast
- **Image Support**: Consistent headshot integration

## 📏 Layout Specifications

### Single-Column Layout Standards

#### Page Structure
```
┌─────────────────────────────────┐
│ Header (Name + Contact)         │ 1-2 inches
├─────────────────────────────────┤
│ Professional Summary            │ 0.5-1 inch
├─────────────────────────────────┤
│ Experience                      │ Variable
├─────────────────────────────────┤
│ Skills                          │ 0.5-1 inch
├─────────────────────────────────┤
│ Education                       │ 0.5-1 inch
├─────────────────────────────────┤
│ Additional Sections             │ Variable
└─────────────────────────────────┘
```

#### Typography Hierarchy
```css
/* Single Column Typography */
h1 { /* Name */
  font-size: 24-28px;
  font-weight: 700;
  margin-bottom: 4px;
}

h2 { /* Section Headers */
  font-size: 16-18px;
  font-weight: 600;
  margin: 20px 0 8px 0;
  border-bottom: 1px solid #ddd;
}

h3 { /* Job Titles, Education */
  font-size: 14-16px;
  font-weight: 600;
  margin: 12px 0 4px 0;
}

p, li { /* Body Text */
  font-size: 11-12px;
  line-height: 1.4;
  margin-bottom: 4px;
}
```

### Two-Column Layout Standards

#### Grid Structure
```css
.two-column-container {
  display: grid;
  grid-template-columns: 2fr 1fr; /* 66% - 33% split */
  gap: 24px;
  max-width: 8.5in;
  margin: 0 auto;
}

@media print {
  .two-column-container {
    gap: 16px; /* Tighter spacing for print */
  }
}
```

#### Main Content (Left Column)
- Professional Summary
- Work Experience  
- Major Projects
- Publications (if applicable)

#### Sidebar (Right Column)
- Professional Headshot
- Contact Information
- Core Skills
- Education
- Certifications
- Languages
- Additional Skills

## 🎨 Template Collection

### Template 1: Classic Professional (Single Column)

#### Visual Identity
- **Color Scheme**: Black text on white background
- **Accent Color**: Navy blue (#1f2937) for section headers
- **Typography**: Arial or Helvetica
- **Style**: Conservative, traditional

#### CSS Implementation
```css
.classic-professional {
  font-family: 'Arial', 'Helvetica', sans-serif;
  color: #1f2937;
  background: white;
  max-width: 8.5in;
  margin: 0 auto;
  padding: 0.75in;
}

.classic-professional h1 {
  color: #1f2937;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: left;
}

.classic-professional .subtitle {
  color: #4b5563;
  font-size: 16px;
  font-style: italic;
  margin-bottom: 16px;
}

.classic-professional h2 {
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
  margin: 24px 0 8px 0;
  padding-bottom: 4px;
  border-bottom: 2px solid #1f2937;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.classic-professional .headshot {
  float: right;
  width: 120px;
  height: 150px;
  margin: 0 0 16px 16px;
  border-radius: 4px;
  object-fit: cover;
}
```

### Template 2: Modern Minimalist (Single Column)

#### Visual Identity
- **Color Scheme**: Dark gray (#374151) with blue accent (#3b82f6)
- **Typography**: System font stack for modern feel
- **Style**: Clean, spacious, contemporary

#### CSS Implementation
```css
.modern-minimalist {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #374151;
  background: white;
  max-width: 8.5in;
  margin: 0 auto;
  padding: 1in;
  line-height: 1.5;
}

.modern-minimalist h1 {
  color: #1f2937;
  font-size: 32px;
  font-weight: 300;
  margin-bottom: 4px;
  letter-spacing: -0.5px;
}

.modern-minimalist h2 {
  color: #3b82f6;
  font-size: 14px;
  font-weight: 600;
  margin: 32px 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.modern-minimalist .headshot {
  float: right;
  width: 100px;
  height: 125px;
  margin: 0 0 20px 20px;
  border-radius: 50%;
  object-fit: cover;
}
```

### Template 3: Executive Two-Column

#### Visual Identity
- **Color Scheme**: Charcoal (#2d3748) with gold accent (#d69e2e)
- **Typography**: Professional serif for headings, sans-serif for body
- **Style**: Executive, premium, sophisticated

#### CSS Implementation
```css
.executive-two-column {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  font-family: 'Georgia', serif;
  color: #2d3748;
  max-width: 8.5in;
  margin: 0 auto;
  padding: 0.75in;
}

.executive-two-column .main-content {
  /* Left column */
}

.executive-two-column .sidebar {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  padding: 24px;
  border-radius: 8px;
}

.executive-two-column h1 {
  color: #2d3748;
  font-size: 28px;
  font-weight: 400;
  margin-bottom: 8px;
  font-family: 'Georgia', serif;
}

.executive-two-column h2 {
  color: #d69e2e;
  font-size: 16px;
  font-weight: 600;
  margin: 24px 0 12px 0;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.executive-two-column .headshot {
  width: 100%;
  max-width: 160px;
  height: 200px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 20px;
}
```

### Template 4: Tech Professional (Two Column)

#### Visual Identity
- **Color Scheme**: Dark theme with cyan accents (#06b6d4)
- **Typography**: Monospace for technical elements, clean sans-serif for content
- **Style**: Modern, tech-focused, clean

#### CSS Implementation
```css
.tech-professional {
  display: grid;
  grid-template-columns: 2.2fr 0.8fr;
  gap: 28px;
  font-family: 'Inter', -apple-system, sans-serif;
  color: #1e293b;
  max-width: 8.5in;
  margin: 0 auto;
  padding: 0.75in;
}

.tech-professional .sidebar {
  background: #f1f5f9;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #06b6d4;
}

.tech-professional h1 {
  color: #0f172a;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 4px;
  font-family: 'Inter', sans-serif;
}

.tech-professional h2 {
  color: #06b6d4;
  font-size: 14px;
  font-weight: 600;
  margin: 20px 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tech-professional .tech-skills {
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 11px;
  background: #f8fafc;
  padding: 8px;
  border-radius: 4px;
  border-left: 3px solid #06b6d4;
}

.tech-professional .headshot {
  width: 100%;
  max-width: 140px;
  height: 175px;
  border-radius: 12px;
  object-fit: cover;
  margin-bottom: 16px;
}
```

## 🖼️ Image Integration Guidelines

### Headshot Specifications

#### Single-Column Layout
```css
.headshot-single {
  float: right;
  width: 100-120px;
  height: 125-150px;
  margin: 0 0 16px 16px;
  border-radius: 4-8px;
  object-fit: cover;
  shape-outside: margin-box;
}
```

#### Two-Column Layout
```css
.headshot-two-column {
  width: 100%;
  max-width: 160px;
  height: 200px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 20px;
  display: block;
}
```

### Image Fallback Strategy
```css
.headshot {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 12px;
  text-align: center;
}

.headshot::before {
  content: "Image not available";
  display: block;
}
```

## 📄 Content Structure Guidelines

### Standard Section Order (Single Column)
1. **Header**: Name, title, contact info
2. **Professional Summary**: 2-3 sentences
3. **Experience**: Reverse chronological order
4. **Skills**: Grouped by category
5. **Education**: Most recent first
6. **Additional**: Certifications, projects, etc.

### Standard Section Distribution (Two Column)

#### Main Content (Left)
1. **Professional Summary**
2. **Work Experience**
3. **Major Projects**
4. **Publications** (if applicable)

#### Sidebar (Right)
1. **Headshot** (top)
2. **Contact Information**
3. **Core Skills**
4. **Education**
5. **Certifications**
6. **Languages**

## 🎯 ATS Optimization Rules

### Required Elements
1. **Semantic HTML**: Proper heading hierarchy (h1 → h2 → h3)
2. **Standard Fonts**: Arial, Helvetica, Times New Roman, Georgia
3. **Text Content**: All important info as selectable text
4. **Simple Structure**: Avoid complex CSS layouts
5. **Standard Sections**: Use conventional section names

### ATS-Friendly Checklist
- [ ] Name in h1 tag
- [ ] Section headers in h2 tags
- [ ] Job titles in h3 tags
- [ ] Contact info in standard format
- [ ] No text in images
- [ ] Consistent date formatting
- [ ] Standard section names
- [ ] Clean, simple layout

## 🔧 Development Guidelines

### Template File Structure
```
templates/
├── single-column/
│   ├── classic-professional.css
│   ├── modern-minimalist.css
│   └── academic.css
├── two-column/
│   ├── executive.css
│   ├── tech-professional.css
│   └── creative.css
└── shared/
    ├── base.css
    ├── print.css
    └── typography.css
```

### CSS Organization
```css
/* Base styles applied to all templates */
@import url('./shared/base.css');
@import url('./shared/typography.css');

/* Template-specific styles */
.template-name {
  /* Layout structure */
}

.template-name h1 {
  /* Name styling */
}

.template-name h2 {
  /* Section headers */
}

/* Print-specific overrides */
@media print {
  @import url('./shared/print.css');
  
  .template-name {
    /* Print adjustments */
  }
}
```

### Template Testing Checklist
- [ ] Renders correctly in all browsers
- [ ] Prints properly on A4 and Letter sizes
- [ ] Maintains layout with varying content lengths
- [ ] Images load and position correctly
- [ ] ATS parsing validation
- [ ] Mobile responsiveness
- [ ] Color contrast accessibility
- [ ] PDF export quality

This guide ensures consistent, professional, and ATS-friendly templates across the entire application.
