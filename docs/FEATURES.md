# Feature Specifications

## 🎯 Core Features

### 1. Markdown Editor

#### Primary Requirements
- **Monaco Editor Integration**: VS Code-like editing experience
- **Syntax Highlighting**: Full markdown syntax support
- **Live Line Numbers**: Easy navigation and reference
- **Auto-completion**: Suggest markdown syntax and common CV sections
- **Keyboard Shortcuts**: Standard editor shortcuts (Ctrl+S, Ctrl+Z, etc.)

#### Technical Specifications
```typescript
interface EditorConfig {
  language: 'markdown';
  theme: 'vs-light' | 'vs-dark';
  fontSize: number;
  wordWrap: 'on' | 'off';
  minimap: { enabled: boolean };
  lineNumbers: 'on' | 'off';
  folding: boolean;
}
```

#### User Experience
- **Auto-save**: Save every 2 seconds to local storage
- **Undo/Redo**: Full history management
- **Find/Replace**: Built-in search functionality
- **Format on Paste**: Clean up pasted content

### 2. Layout System

#### Single-Column Layout
**Target Use Case**: ATS-optimized resumes for traditional industries

**Structure**:
```
┌─────────────────────────────────┐
│ Header (Name, Title, Image)     │
├─────────────────────────────────┤
│ Contact Information             │
├─────────────────────────────────┤
│ Professional Summary            │
├─────────────────────────────────┤
│ Experience                      │
├─────────────────────────────────┤
│ Skills                          │
├─────────────────────────────────┤
│ Education                       │
└─────────────────────────────────┘
```

**CSS Implementation**:
```css
.single-column {
  max-width: 8.5in;
  margin: 0 auto;
  padding: 0.75in;
  font-family: 'Arial', sans-serif;
  line-height: 1.4;
}

.cv-header {
  position: relative;
  min-height: 160px;
}

.cv-header-text {
  margin-right: 140px; /* Space for headshot */
}

.cv-name {
  display: block;
  margin-bottom: 8px;
}

.cv-title {
  display: block;
  margin-bottom: 16px;
}

.cv-headshot {
  position: absolute;
  top: 0;
  right: 0;
  width: 120px;
  height: 150px;
  border-radius: 4px;
  object-fit: cover;
}
```

#### Two-Column Layout
**Target Use Case**: Modern, visual resumes for creative and tech industries

**Structure**:
```
┌─────────────────────┬─────────────┐
│ Name & Title        │ Headshot    │
├─────────────────────┼─────────────┤
│ Professional        │ Contact     │
│ Summary             │ Info        │
├─────────────────────┤             │
│ Experience          │ Skills      │
│                     │             │
│                     │ Education   │
│                     │             │
│                     │ Languages   │
└─────────────────────┴─────────────┘
```

**CSS Implementation**:
```css
.two-column {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  max-width: 8.5in;
  margin: 0 auto;
  padding: 0.75in;
}

.main-content {
  /* Left column content */
}

.sidebar {
  /* Right column content */
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}
```

### 3. Image Integration

#### Markdown Image Syntax Support
```markdown
![Professional Headshot](https://example.com/image.jpg)
```

#### Image Processing Rules
1. **Detection**: First image in markdown becomes the headshot
2. **Positioning**: Automatic positioning based on layout
3. **Fallback**: Graceful degradation if image fails to load
4. **Styling**: Consistent styling across templates

#### Implementation
```typescript
interface ImageConfig {
  src: string;
  alt: string;
  isHeadshot: boolean;
  position: 'inline' | 'sidebar' | 'header';
  styling: {
    width: string;
    height: string;
    borderRadius: string;
    objectFit: 'cover' | 'contain';
  };
}

function extractHeadshot(markdown: string): ImageConfig | null {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/;
  const match = markdown.match(imageRegex);
  
  if (match) {
    return {
      src: match[2],
      alt: match[1] || 'Professional Headshot',
      isHeadshot: true,
      position: 'sidebar', // Default for two-column
      styling: {
        width: '150px',
        height: '200px',
        borderRadius: '8px',
        objectFit: 'cover'
      }
    };
  }
  return null;
}
```

### 4. PDF Export System

#### Export Options
1. **Standard PDF**: Full layout with images and styling
2. **ATS-Friendly PDF**: Single-column, text-optimized
3. **Print PDF**: Optimized for physical printing

#### Technical Implementation
```typescript
interface ExportConfig {
  format: 'standard' | 'ats' | 'print';
  layout: 'single-column' | 'two-column';
  includeImages: boolean;
  pageSize: 'A4' | 'Letter';
  margins: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
}

// API Route: /api/pdf
async function generatePDF(content: string, config: ExportConfig) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set page size and margins
  await page.pdf({
    format: config.pageSize,
    margin: config.margins,
    printBackground: true
  });
}
```

#### ATS Optimization Features
- **Semantic HTML**: Proper heading hierarchy (h1 → h2 → h3)
- **Text Selection**: All content selectable as text
- **Standard Fonts**: Arial, Helvetica, Times New Roman
- **Clean Structure**: No complex CSS that might break parsing
- **Keyword Optimization**: Proper section naming

### 5. Local Storage Persistence

#### Data Structure
```typescript
interface StoredCV {
  id: string;
  name: string;
  content: string;
  layout: 'single-column' | 'two-column';
  template: string;
  lastModified: Date;
  version: number;
}

interface StorageManager {
  save(cv: StoredCV): void;
  load(id: string): StoredCV | null;
  list(): StoredCV[];
  delete(id: string): void;
  export(): string; // JSON export
  import(data: string): StoredCV[]; // JSON import
}
```

#### Auto-save Strategy
- **Trigger**: Save every 2 seconds after last edit
- **Debouncing**: Prevent excessive saves during rapid typing
- **Version Management**: Keep last 10 versions for undo
- **Storage Limits**: Monitor localStorage usage (5MB limit)

## 🎨 Template System

### Template Architecture
```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  layout: 'single-column' | 'two-column';
  styles: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
    };
    typography: {
      headingFont: string;
      bodyFont: string;
      fontSize: {
        h1: string;
        h2: string;
        h3: string;
        body: string;
      };
    };
    spacing: {
      sectionGap: string;
      itemGap: string;
      padding: string;
    };
  };
  preview: string; // Preview image URL
}
```

### Initial Template Collection

#### Single-Column Templates
1. **Classic Professional**
   - Traditional black text on white
   - Conservative styling
   - Maximum ATS compatibility

2. **Modern Minimalist**
   - Clean lines and spacing
   - Subtle accent colors
   - Contemporary typography

3. **Academic**
   - Optimized for academic positions
   - Publications and research focus
   - Traditional formatting

#### Two-Column Templates
1. **Executive**
   - Professional color scheme
   - Executive-level positioning
   - Premium visual hierarchy

2. **Tech Professional**
   - Modern tech industry styling
   - Skill-focused sidebar
   - Clean, contemporary design

3. **Creative Professional**
   - More visual elements
   - Creative industry appropriate
   - Balanced text and visual elements

## 🔧 User Interface Components

### Main Application Layout
```tsx
interface AppLayout {
  header: {
    logo: React.Component;
    templateSelector: React.Component;
    layoutToggle: React.Component;
    exportButton: React.Component;
    themeToggle: React.Component;
  };
  main: {
    editor: React.Component;
    splitter: React.Component;
    preview: React.Component;
  };
  footer: {
    statusBar: React.Component;
    helpLinks: React.Component;
  };
}
```

### Editor Toolbar
```tsx
interface EditorToolbar {
  formatting: {
    bold: () => void;
    italic: () => void;
    heading: (level: 1 | 2 | 3) => void;
    list: (type: 'bullet' | 'numbered') => void;
  };
  insertion: {
    link: () => void;
    image: () => void;
    table: () => void;
    divider: () => void;
  };
  actions: {
    undo: () => void;
    redo: () => void;
    find: () => void;
    replace: () => void;
  };
}
```

### Preview Controls
```tsx
interface PreviewControls {
  zoom: {
    level: number; // 50% to 200%
    zoomIn: () => void;
    zoomOut: () => void;
    reset: () => void;
  };
  layout: {
    current: 'single-column' | 'two-column';
    switch: () => void;
  };
  template: {
    current: string;
    change: (templateId: string) => void;
  };
}
```

## 📱 Responsive Design Specifications

### Breakpoint Strategy
```css
/* Mobile First */
@media (min-width: 320px) {
  /* Mobile phones */
  .app-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }
  
  .editor-preview {
    flex-direction: column;
  }
}

@media (min-width: 768px) {
  /* Tablets */
  .editor-preview {
    flex-direction: row;
  }
}

@media (min-width: 1024px) {
  /* Desktop */
  .app-layout {
    grid-template-columns: auto 1fr auto;
  }
}
```

### Mobile Adaptations
- **Editor/Preview Toggle**: Swipeable tabs on mobile
- **Touch Targets**: Minimum 44px tap targets
- **Keyboard Handling**: Virtual keyboard considerations
- **Gesture Support**: Pinch to zoom in preview

## 🎯 User Experience Features

### Onboarding Experience
1. **Welcome Tour**: Interactive guide for first-time users
2. **Sample CV**: Pre-loaded example to demonstrate features
3. **Template Gallery**: Visual template selection
4. **Getting Started Guide**: Step-by-step CV creation

### Help & Documentation
1. **Markdown Guide**: Built-in markdown syntax reference
2. **CV Writing Tips**: Professional CV writing guidelines
3. **Image Guidelines**: Best practices for professional headshots
4. **Keyboard Shortcuts**: Quick reference panel

### Error Handling
1. **Image Load Failures**: Graceful fallback with placeholder
2. **PDF Generation Errors**: Clear error messages and retry options
3. **Storage Failures**: Warning when localStorage is full
4. **Network Issues**: Offline mode detection

## 🔄 Future Enhancements

### Phase 2 Features
- **Multiple CV Management**: Create and manage multiple CVs
- **Version History**: Track changes over time
- **Collaboration**: Share CVs for feedback
- **Export Formats**: HTML, JSON, Word document

### Phase 3 Features
- **Cloud Sync**: Optional cloud storage
- **Team Features**: Company templates and branding
- **Analytics**: Track PDF downloads and views
- **Integration**: LinkedIn import, job board integration

This specification serves as the detailed blueprint for implementing all features with consistent quality and user experience.
