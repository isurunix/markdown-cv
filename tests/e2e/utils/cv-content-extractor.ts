import { Page } from '@playwright/test';

export interface CVContent {
  name: string;
  title: string;
  contactInfo: ContactInfo;
  sections: Record<string, string>;
  fullText: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  linkedin: string;
  portfolio: string;
  location: string;
}

/**
 * Extract structured CV content from the preview DOM
 */
export const extractPreviewContent = async (page: Page): Promise<CVContent> => {
  return await page.evaluate(() => {
    // Find the visible preview element (prefer first visible one)
    const previewElements = document.querySelectorAll('.cv-preview-content, .cv-pdf-export');
    let previewElement: Element | null = null;
    
    for (const el of previewElements) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        previewElement = el;
        break;
      }
    }
    
    if (!previewElement && previewElements.length > 0) {
      // Fallback to first element if none are visible
      previewElement = previewElements[0];
    }
    
    if (!previewElement) {
      throw new Error('CV preview element not found');
    }

    // Helper functions defined inside page.evaluate
    function extractContactInfo(element: Element): ContactInfo {
      // Look for contact section first
      const contactSection = findSectionByHeading(element, 'Contact Information') || 
                            element.querySelector('.cv-contact') ||
                            element;
      const contactText = contactSection.textContent || '';
      
      // Extract email
      const emailMatch = contactText.match(/[\w\.-]+@[\w\.-]+\.\w+/);
      const email = emailMatch ? emailMatch[0] : '';

      // Extract phone - more flexible patterns
      const phoneMatch = contactText.match(/[\+]?[1]?[-\s]?[\(]?[0-9]{3}[\)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4}/) ||
                        contactText.match(/\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
      const phone = phoneMatch ? phoneMatch[0] : '';

      // Extract LinkedIn - look for various patterns
      const linkedinMatch = contactText.match(/linkedin\.com\/in\/[\w-]+/) || 
                           contactText.match(/LinkedIn.*?([\w-]+)/) ||
                           contactText.match(/🔗\s*LinkedIn/);
      const linkedin = linkedinMatch ? linkedinMatch[0] : '';

      // Extract portfolio/website
      const portfolioMatch = contactText.match(/https?:\/\/[\w\.-]+\.\w+/) ||
                            contactText.match(/🌐\s*Portfolio/) ||
                            contactText.match(/[\w-]+\.design/) ||
                            contactText.match(/[\w-]+\.dev/);
      const portfolio = portfolioMatch ? portfolioMatch[0] : '';

      // Extract location - look for location emoji or common patterns
      const locationMatch = contactText.match(/📍\s*([^,\n]+(?:,\s*[A-Z]{2})?)/);
      const location = locationMatch ? locationMatch[1].trim() : '';

      return {
        email,
        phone,
        linkedin,
        portfolio,
        location
      };
    }

    function extractSections(element: Element): Record<string, string> {
      const sections: Record<string, string> = {};
      
      // Common CV sections to extract
      const sectionHeadings = [
        'Professional Summary',
        'Experience',
        'Skills',
        'Education',
        'Certifications',
        'Awards',
        'Publications'
      ];

      sectionHeadings.forEach(heading => {
        const sectionElement = findSectionByHeading(element, heading);
        if (sectionElement) {
          const sectionText = sectionElement.textContent?.trim() || '';
          sections[heading] = sectionText;
        }
      });

      return sections;
    }

    function findSectionByHeading(element: Element, headingText: string): Element | null {
      const headings = element.querySelectorAll('h1, h2, h3');
      
      for (const heading of headings) {
        if (heading.textContent?.trim().toLowerCase().includes(headingText.toLowerCase())) {
          // Find the content between this heading and the next heading
          let currentElement = heading.nextElementSibling;
          const sectionContent = [heading];
          
          while (currentElement && !isHeading(currentElement)) {
            sectionContent.push(currentElement);
            currentElement = currentElement.nextElementSibling;
          }
          
          // Create a temporary container for the section
          const container = document.createElement('div');
          sectionContent.forEach(el => {
            container.appendChild(el.cloneNode(true));
          });
          
          return container;
        }
      }
      
      return null;
    }

    function isHeading(element: Element): boolean {
      return ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName);
    }

    // Extract name (from .cv-name class or fallback to first H1)
    const nameElement = previewElement.querySelector('.cv-name') ||
                       previewElement.querySelector('h1');
    const name = nameElement?.textContent?.trim() || '';

    // Extract title (from .cv-title class or fallback to strong elements)
    const titleElement = previewElement.querySelector('.cv-title') ||
                        previewElement.querySelector('h1 + p strong') || 
                        previewElement.querySelector('p strong');
    const title = titleElement?.textContent?.trim() || '';

    // Extract contact information
    const contactInfo = extractContactInfo(previewElement);

    // Extract sections
    const sections = extractSections(previewElement);

    // Get full text content
    const fullText = previewElement.textContent?.replace(/\s+/g, ' ').trim() || '';

    return {
      name,
      title,
      contactInfo,
      sections,
      fullText
    };
  });
};

/**
 * Wait for the CV preview to be fully loaded and rendered
 */
export const waitForCVPreviewToLoad = async (page: Page): Promise<void> => {
  // Wait for the preview element to be visible (use first one to avoid conflicts)
  await page.waitForSelector('.cv-preview-content:first-of-type', { 
    state: 'visible',
    timeout: 10000 
  });

  // Wait for content to be rendered (check if it has substantial text)
  await page.waitForFunction(() => {
    const previews = document.querySelectorAll('.cv-preview-content');
    // Use the first visible preview with content
    for (const preview of previews) {
      const text = preview.textContent?.trim() || '';
      if (text.length > 100) {
        return true;
      }
    }
    return false;
  }, { timeout: 10000 });

  // Additional wait for any dynamic content loading
  await page.waitForTimeout(1000);
};
