import pdfParse from 'pdf-parse';
import { ContactInfo } from './cv-content-extractor';

export interface PDFContent {
  fullText: string;
  pageCount: number;
  sections: Record<string, string>;
  name: string;
  title: string;
  contactInfo: ContactInfo;
}

/**
 * Extract text content from PDF buffer
 */
export const extractPDFContent = async (pdfBuffer: Buffer): Promise<PDFContent> => {
  try {
    const pdfData = await pdfParse(pdfBuffer);
    
    // Normalize whitespace and line breaks
    const normalizedText = pdfData.text
      .replace(/\s+/g, ' ')
      .trim();

    // Extract structured content from PDF text
    const name = extractNameFromPDF(normalizedText);
    const title = extractTitleFromPDF(normalizedText);
    const contactInfo = extractContactInfoFromPDF(normalizedText);
    const sections = extractSectionsFromPDF(normalizedText);

    return {
      fullText: normalizedText,
      pageCount: pdfData.numpages,
      sections,
      name,
      title,
      contactInfo
    };
  } catch (error) {
    throw new Error(`Failed to extract PDF content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Extract name from PDF text (usually the first prominent text)
 */
function extractNameFromPDF(text: string): string {
  // Look for name patterns at the beginning of the document
  const lines = text.split(/\n|\r\n/).map(line => line.trim()).filter(line => line.length > 0);
  
  if (lines.length > 0) {
    // The first substantial line is usually the name
    const firstLine = lines[0];
    // Clean up any formatting artifacts
    return firstLine.replace(/[^\w\s.-]/g, '').trim();
  }
  
  return '';
}

/**
 * Extract title from PDF text (usually follows the name)
 */
function extractTitleFromPDF(text: string): string {
  const lines = text.split(/\n|\r\n/).map(line => line.trim()).filter(line => line.length > 0);
  
  if (lines.length > 1) {
    // The second line is often the job title
    const secondLine = lines[1];
    // Clean up formatting and check if it looks like a job title
    const cleanedLine = secondLine.replace(/[^\w\s&|-]/g, '').trim();
    
    // Job titles often contain these keywords
    const jobTitleKeywords = [
      'engineer', 'developer', 'designer', 'manager', 'director', 
      'analyst', 'consultant', 'specialist', 'architect', 'lead'
    ];
    
    if (jobTitleKeywords.some(keyword => 
      cleanedLine.toLowerCase().includes(keyword.toLowerCase())
    )) {
      return cleanedLine;
    }
  }
  
  return '';
}

/**
 * Extract contact information from PDF text
 */
function extractContactInfoFromPDF(text: string): ContactInfo {
  // Extract email
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
  const email = emailMatch ? emailMatch[0] : '';

  // Extract phone
  const phoneMatch = text.match(/\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // Extract LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/) || 
                       text.match(/LinkedIn[:\s]+(\w+)/i);
  const linkedin = linkedinMatch ? linkedinMatch[0] : '';

  // Extract portfolio/website
  const portfolioMatch = text.match(/https?:\/\/[\w\.-]+\.\w+/) ||
                        text.match(/[\w-]+\.(?:design|dev|com)/) ||
                        text.match(/Portfolio[:\s]+([\w.-]+)/i);
  const portfolio = portfolioMatch ? portfolioMatch[0] : '';

  // Extract location
  const locationMatch = text.match(/(?:New York|San Francisco|Seattle|Boston|Austin|Los Angeles|Chicago)(?:,\s*[A-Z]{2})?/) ||
                       text.match(/[A-Z][a-z]+(?:,\s*[A-Z]{2})/);
  const location = locationMatch ? locationMatch[0] : '';

  return {
    email,
    phone,
    linkedin,
    portfolio,
    location
  };
}

/**
 * Extract sections from PDF text
 */
function extractSectionsFromPDF(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  
  // Common section headers in CVs
  const sectionPatterns = [
    { name: 'Professional Summary', pattern: new RegExp('(?:Professional Summary|Summary|Profile)(.*?)(?=(?:Experience|Education|Skills|Contact)|$)', 'gis') },
    { name: 'Experience', pattern: new RegExp('(?:Experience|Work Experience|Employment)(.*?)(?=(?:Education|Skills|Certifications|Contact)|$)', 'gis') },
    { name: 'Skills', pattern: new RegExp('(?:Skills|Technical Skills|Competencies)(.*?)(?=(?:Education|Experience|Certifications|Contact)|$)', 'gis') },
    { name: 'Education', pattern: new RegExp('(?:Education|Academic Background)(.*?)(?=(?:Experience|Skills|Certifications|Contact)|$)', 'gis') },
    { name: 'Certifications', pattern: new RegExp('(?:Certifications?|Licenses?)(.*?)(?=(?:Education|Experience|Skills|Awards|Contact)|$)', 'gis') },
    { name: 'Awards', pattern: new RegExp('(?:Awards?|Recognition|Achievements?)(.*?)(?=(?:Education|Experience|Skills|Contact)|$)', 'gis') }
  ];

  sectionPatterns.forEach(({ name, pattern }) => {
    const match = text.match(pattern);
    if (match && match[1]) {
      // Clean up the extracted section text
      const sectionText = match[1]
        .trim()
        .replace(/\s+/g, ' ')
        .substring(0, 1000); // Limit length to avoid massive sections
      
      if (sectionText.length > 10) { // Only include if substantial content
        sections[name] = sectionText;
      }
    }
  });

  return sections;
}

/**
 * Calculate text similarity between two strings
 */
export const calculateTextSimilarity = (text1: string, text2: string): number => {
  // Normalize both texts
  const normalize = (text: string) => 
    text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

  const normalized1 = normalize(text1);
  const normalized2 = normalize(text2);

  if (normalized1.length === 0 && normalized2.length === 0) return 1;
  if (normalized1.length === 0 || normalized2.length === 0) return 0;

  // Simple word-based similarity
  const words1 = new Set(normalized1.split(' '));
  const words2 = new Set(normalized2.split(' '));
  
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
};
