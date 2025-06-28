// CV Data Types
export interface CVData {
  markdown: string;
  layout: 'single-column' | 'two-column';
  template: string;
  lastModified: Date;
}

// Layout System Types
export interface LayoutConfig {
  type: 'single-column' | 'two-column';
  imageHandling: {
    position: 'inline' | 'sidebar' | 'header';
    maxWidth: string;
    shape: 'circle' | 'rounded' | 'square';
  };
}

// Template System Types
export interface Template {
  id: string;
  name: string;
  description: string;
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
  preview: string;
}

// Image Handling Types
export interface ImageConfig {
  src: string;
  alt: string;
  isHeadshot: boolean;
  position: 'inline' | 'sidebar' | 'header';
  shape: 'rectangular' | 'circular';
  styling: {
    width: string;
    height: string;
    borderRadius: string;
    objectFit: 'cover' | 'contain';
  };
}

// State Management Types
export interface CVState {
  // Core content
  markdown: string;
  layout: 'single-column' | 'two-column';
  template: string;
  pageFormat: 'A4' | 'US Letter';
  
  // UI state
  editorVisible: boolean;
  previewVisible: boolean;
  darkMode: boolean;
  
  // Export state
  isExporting: boolean;
  lastExported: Date | null;
  
  // Actions
  setMarkdown: (markdown: string) => void;
  setLayout: (layout: 'single-column' | 'two-column') => void;
  setTemplate: (template: string) => void;
  setPageFormat: (format: 'A4' | 'US Letter') => void;
  toggleEditor: () => void;
  togglePreview: () => void;
  toggleDarkMode: () => void;
  setExporting: (isExporting: boolean) => void;
}

// Local Storage Types
export interface StoredCV {
  id: string;
  name: string;
  content: string;
  layout: 'single-column' | 'two-column';
  template: string;
  lastModified: Date;
  version: number;
}

// PDF Export Types
export interface ExportConfig {
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
