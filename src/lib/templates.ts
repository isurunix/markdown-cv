import { Template } from '@/types/cv';

export const templates: Record<string, Template> = {
  'classic-professional': {
    id: 'classic-professional',
    name: 'Classic Professional',
    description: 'Traditional, ATS-friendly format perfect for conservative industries',
    layout: 'single-column',
    styles: {
      colors: {
        primary: '#1f2937',
        secondary: '#4b5563',
        accent: '#1f2937',
        text: '#1f2937'
      },
      typography: {
        headingFont: 'Arial, Helvetica, sans-serif',
        bodyFont: 'Arial, Helvetica, sans-serif',
        fontSize: {
          h1: '28px',
          h2: '16px',
          h3: '14px',
          body: '12px'
        }
      },
      spacing: {
        sectionGap: '24px',
        itemGap: '12px',
        padding: '0.75in'
      }
    },
    preview: '/templates/classic-professional.png'
  },

  'modern-minimalist': {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    description: 'Clean, contemporary design with subtle accents',
    layout: 'single-column',
    styles: {
      colors: {
        primary: '#374151',
        secondary: '#6b7280',
        accent: '#3b82f6',
        text: '#374151'
      },
      typography: {
        headingFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        bodyFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: {
          h1: '32px',
          h2: '14px',
          h3: '16px',
          body: '12px'
        }
      },
      spacing: {
        sectionGap: '32px',
        itemGap: '12px',
        padding: '1in'
      }
    },
    preview: '/templates/modern-minimalist.png'
  },

  'executive-two-column': {
    id: 'executive-two-column',
    name: 'Executive',
    description: 'Premium two-column layout for senior positions',
    layout: 'two-column',
    styles: {
      colors: {
        primary: '#2d3748',
        secondary: '#4a5568',
        accent: '#d69e2e',
        text: '#2d3748'
      },
      typography: {
        headingFont: 'Georgia, serif',
        bodyFont: '-apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: {
          h1: '28px',
          h2: '16px',
          h3: '14px',
          body: '11px'
        }
      },
      spacing: {
        sectionGap: '24px',
        itemGap: '10px',
        padding: '0.75in'
      }
    },
    preview: '/templates/executive-two-column.png'
  },

  'tech-professional': {
    id: 'tech-professional',
    name: 'Tech Professional',
    description: 'Modern two-column design tailored for tech industry',
    layout: 'two-column',
    styles: {
      colors: {
        primary: '#0f172a',
        secondary: '#334155',
        accent: '#06b6d4',
        text: '#1e293b'
      },
      typography: {
        headingFont: 'Inter, -apple-system, sans-serif',
        bodyFont: 'Inter, -apple-system, sans-serif',
        fontSize: {
          h1: '26px',
          h2: '14px',
          h3: '14px',
          body: '11px'
        }
      },
      spacing: {
        sectionGap: '20px',
        itemGap: '10px',
        padding: '0.75in'
      }
    },
    preview: '/templates/tech-professional.png'
  }
};

export const getTemplate = (templateId: string): Template => {
  return templates[templateId] || templates['classic-professional'];
};

export const getTemplatesByLayout = (layout: 'single-column' | 'two-column'): Template[] => {
  return Object.values(templates).filter(template => template.layout === layout);
};

export const getAllTemplates = (): Template[] => {
  return Object.values(templates);
};
