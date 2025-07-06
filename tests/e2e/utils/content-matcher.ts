import { CVContent, ContactInfo } from './cv-content-extractor';
import { PDFContent, calculateTextSimilarity } from './pdf-text-extractor';

export interface ContentComparison {
  nameMatch: boolean;
  titleMatch: boolean;
  contactMatch: ContactComparison;
  sectionsMatch: SectionComparison;
  overallSimilarity: number;
  isAcceptable: boolean;
}

export interface ContactComparison {
  emailMatch: boolean;
  phoneMatch: boolean;
  linkedinMatch: boolean;
  portfolioMatch: boolean;
  locationMatch: boolean;
  overallMatch: boolean;
}

export interface SectionComparison {
  [sectionName: string]: {
    similarity: number;
    isAcceptable: boolean;
  };
}

/**
 * Compare CV content between preview and PDF
 */
export const compareContent = (
  content1: CVContent | PDFContent, 
  content2: CVContent | PDFContent
): ContentComparison => {
  
  const nameMatch = fuzzyMatch(content1.name, content2.name, 0.9);
  const titleMatch = fuzzyMatch(content1.title, content2.title, 0.8);
  const contactMatch = compareContactInfo(content1.contactInfo, content2.contactInfo);
  const sectionsMatch = compareSections(content1.sections, content2.sections);
  const overallSimilarity = calculateTextSimilarity(content1.fullText, content2.fullText);
  
  // Determine if the comparison is acceptable
  const isAcceptable = 
    nameMatch &&
    contactMatch.overallMatch &&
    overallSimilarity >= 0.85 && // 85% overall similarity threshold
    Object.values(sectionsMatch).every(section => section.isAcceptable);

  return {
    nameMatch,
    titleMatch,
    contactMatch,
    sectionsMatch,
    overallSimilarity,
    isAcceptable
  };
};

/**
 * Fuzzy match two strings with a similarity threshold
 */
export const fuzzyMatch = (str1: string, str2: string, threshold: number = 0.8): boolean => {
  const similarity = calculateTextSimilarity(str1, str2);
  return similarity >= threshold;
};

/**
 * Compare contact information between preview and PDF
 */
export const compareContactInfo = (
  previewContact: ContactInfo, 
  pdfContact: ContactInfo
): ContactComparison => {
  
  const emailMatch = normalizeAndCompare(previewContact.email, pdfContact.email);
  const phoneMatch = normalizePhone(previewContact.phone) === normalizePhone(pdfContact.phone);
  const linkedinMatch = normalizeUrl(previewContact.linkedin).includes(normalizeUrl(pdfContact.linkedin)) ||
                       normalizeUrl(pdfContact.linkedin).includes(normalizeUrl(previewContact.linkedin));
  const portfolioMatch = normalizeUrl(previewContact.portfolio).includes(normalizeUrl(pdfContact.portfolio)) ||
                        normalizeUrl(pdfContact.portfolio).includes(normalizeUrl(previewContact.portfolio));
  const locationMatch = normalizeAndCompare(previewContact.location, pdfContact.location);

  // Contact info is considered matching if critical info (email) matches and at least 2 other fields match
  const matchCount = [emailMatch, phoneMatch, linkedinMatch, portfolioMatch, locationMatch]
    .filter(Boolean).length;
  
  const overallMatch = emailMatch && matchCount >= 3;

  return {
    emailMatch,
    phoneMatch,
    linkedinMatch,
    portfolioMatch,
    locationMatch,
    overallMatch
  };
};

/**
 * Compare sections between preview and PDF
 */
export const compareSections = (
  previewSections: Record<string, string>,
  pdfSections: Record<string, string>
): SectionComparison => {
  
  const comparison: SectionComparison = {};
  
  // Get all section names from both sources
  const allSections = new Set([
    ...Object.keys(previewSections),
    ...Object.keys(pdfSections)
  ]);

  allSections.forEach(sectionName => {
    const previewText = previewSections[sectionName] || '';
    const pdfText = pdfSections[sectionName] || '';
    
    const similarity = calculateTextSimilarity(previewText, pdfText);
    
    // Different thresholds for different section types
    let threshold = 0.7; // Default threshold
    
    if (sectionName.toLowerCase().includes('experience')) {
      threshold = 0.8; // Higher threshold for experience (critical section)
    } else if (sectionName.toLowerCase().includes('skills')) {
      threshold = 0.75; // Medium threshold for skills
    } else if (sectionName.toLowerCase().includes('summary')) {
      threshold = 0.7; // Lower threshold for summary (may have formatting differences)
    }
    
    comparison[sectionName] = {
      similarity,
      isAcceptable: similarity >= threshold
    };
  });

  return comparison;
};

/**
 * Normalize text for comparison
 */
const normalizeAndCompare = (text1: string, text2: string): boolean => {
  const normalize = (text: string) => 
    text.toLowerCase()
        .replace(/[^\w]/g, '')
        .trim();
  
  const normalized1 = normalize(text1);
  const normalized2 = normalize(text2);
  
  if (!normalized1 || !normalized2) return false;
  
  return normalized1 === normalized2 || 
         normalized1.includes(normalized2) || 
         normalized2.includes(normalized1);
};

/**
 * Normalize phone number for comparison
 */
const normalizePhone = (phone: string): string => {
  return phone.replace(/[^\d]/g, '');
};

/**
 * Normalize URL for comparison
 */
const normalizeUrl = (url: string): string => {
  return url.toLowerCase()
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '')
            .replace(/\/$/, '');
};

/**
 * Extract key CV elements for focused comparison
 */
export const extractKeyCVElements = (content: CVContent | PDFContent) => {
  return {
    personalInfo: {
      name: content.name,
      title: content.title,
      email: content.contactInfo.email,
      phone: content.contactInfo.phone
    },
    criticalSections: [
      'Professional Summary',
      'Experience', 
      'Skills',
      'Education'
    ].map(section => ({
      name: section,
      content: content.sections[section] || ''
    }))
  };
};

/**
 * Generate a detailed comparison report
 */
export const generateComparisonReport = (comparison: ContentComparison): string => {
  const lines = [
    '=== CV Content Comparison Report ===',
    '',
    `Overall Similarity: ${(comparison.overallSimilarity * 100).toFixed(1)}%`,
    `Name Match: ${comparison.nameMatch ? '✅' : '❌'}`,
    `Title Match: ${comparison.titleMatch ? '✅' : '❌'}`,
    '',
    '--- Contact Information ---',
    `Email: ${comparison.contactMatch.emailMatch ? '✅' : '❌'}`,
    `Phone: ${comparison.contactMatch.phoneMatch ? '✅' : '❌'}`,
    `LinkedIn: ${comparison.contactMatch.linkedinMatch ? '✅' : '❌'}`,
    `Portfolio: ${comparison.contactMatch.portfolioMatch ? '✅' : '❌'}`,
    `Location: ${comparison.contactMatch.locationMatch ? '✅' : '❌'}`,
    '',
    '--- Sections ---'
  ];

  Object.entries(comparison.sectionsMatch).forEach(([section, result]) => {
    lines.push(`${section}: ${(result.similarity * 100).toFixed(1)}% ${result.isAcceptable ? '✅' : '❌'}`);
  });

  lines.push('');
  lines.push(`Final Result: ${comparison.isAcceptable ? '✅ PASS' : '❌ FAIL'}`);

  return lines.join('\n');
};
