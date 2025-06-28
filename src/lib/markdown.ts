import { ImageConfig } from '@/types/cv';

/**
 * Extract the first image from markdown content to use as headshot
 * Supports shape in alt text: ![circular](url) or ![rectangular](url)
 */
export function extractHeadshot(markdown: string): ImageConfig | null {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/;
  const match = markdown.match(imageRegex);
  
  if (match) {
    const altText = match[1].toLowerCase().trim();
    const shape = (altText === 'circular' || altText === 'rectangular') ? altText as 'circular' | 'rectangular' : 'rectangular';
    
    return {
      src: match[2],
      alt: shape === 'circular' ? 'Circular Headshot' : 'Rectangular Headshot',
      isHeadshot: true,
      position: 'sidebar', // Default for two-column
      shape,
      styling: {
        width: shape === 'circular' ? '140px' : '140px', // Use 140px for two-column layout
        height: shape === 'circular' ? '140px' : '175px',
        borderRadius: shape === 'circular' ? '50%' : '8px',
        objectFit: 'cover'
      }
    };
  }
  return null;
}

/**
 * Remove the first image from markdown content (since it will be displayed separately)
 */
export function removeHeadshotFromMarkdown(markdown: string): string {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)\n?/;
  return markdown.replace(imageRegex, '').trim();
}

/**
 * Process markdown content for CV rendering
 */
export function processMarkdownForCV(markdown: string, layout: 'single-column' | 'two-column') {
  const headshot = extractHeadshot(markdown);
  let contentWithoutHeadshot = removeHeadshotFromMarkdown(markdown);
  let contentWithoutTitle = removeTitleFromMarkdown(contentWithoutHeadshot);
  
  return {
    headshot,
    content: contentWithoutTitle,
    hasImage: !!headshot
  };
}

/**
 * Split markdown content into sections for two-column layout
 */
export function splitContentForTwoColumn(markdown: string) {
  const lines = markdown.split('\n');
  const sections = [];
  let currentSection = '';
  
  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection.trim());
      }
      currentSection = line + '\n';
    } else {
      currentSection += line + '\n';
    }
  }
  
  if (currentSection) {
    sections.push(currentSection.trim());
  }
  
  // Define which sections go in main content vs sidebar
  const mainSections = ['Professional Summary', 'Experience', 'Projects'];
  const sidebarSections = ['Contact Information', 'Skills', 'Education', 'Certifications', 'Languages'];
  
  const mainContent = [];
  const sidebarContent = [];
  
  for (const section of sections) {
    const sectionTitle = section.split('\n')[0].replace('## ', '');
    
    if (mainSections.some(main => sectionTitle.includes(main))) {
      mainContent.push(section);
    } else if (sidebarSections.some(sidebar => sectionTitle.includes(sidebar))) {
      sidebarContent.push(section);
    } else {
      // Default to main content for unknown sections
      mainContent.push(section);
    }
  }
  
  return {
    mainContent: mainContent.join('\n\n'),
    sidebarContent: sidebarContent.join('\n\n')
  };
}

/**
 * Extract the name (first h1) from markdown
 */
export function extractName(markdown: string): string {
  const nameMatch = markdown.match(/^# (.+)$/m);
  return nameMatch ? nameMatch[1] : 'Your Name';
}

/**
 * Extract the title/subtitle (first bold text after name) from markdown
 */
export function extractTitle(markdown: string): string {
  const lines = markdown.split('\n');
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    const boldMatch = line.match(/\*\*(.+)\*\*/);
    if (boldMatch) {
      return boldMatch[1];
    }
  }
  return 'Professional Title';
}

/**
 * Remove the title (first bold text) from markdown content
 */
export function removeTitleFromMarkdown(markdown: string): string {
  const lines = markdown.split('\n');
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (line.match(/\*\*(.+)\*\*/)) {
      // Remove this line and return the modified content
      lines.splice(i, 1);
      return lines.join('\n').trim();
    }
  }
  return markdown;
}

/**
 * Validate image URL and provide fallback
 */
export function validateImageUrl(url: string): string {
  try {
    new URL(url);
    return url;
  } catch {
    // Return a placeholder image if URL is invalid
    return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face';
  }
}

/**
 * Generate auto-save key for localStorage
 */
export function generateAutoSaveKey(): string {
  return `cv-autosave-${Date.now()}`;
}

/**
 * Debounce function for auto-save
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
