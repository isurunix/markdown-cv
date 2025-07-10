"use client";

import { extractContactInfo, extractName, extractTitle, splitContentForTwoColumn, validateImageUrl } from '@/lib/markdown';
import '@/styles/layouts/two-column.css';
import { Template } from '@/types/cv';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TwoColumnLayoutProps {
  content: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    headshot: any;
    content: string;
    hasImage: boolean;
  };
  originalMarkdown: string;
  template: Template;
  zoom: number;
}

export function TwoColumnLayout({ content, originalMarkdown, template }: TwoColumnLayoutProps) {
  const name = extractName(originalMarkdown);
  const title = extractTitle(originalMarkdown);
  const contactInfo = extractContactInfo(originalMarkdown);
  
  // Content is already cleaned, split it for two-column layout
  const { mainContent, sidebarContent } = splitContentForTwoColumn(content.content);
  
  // Create custom styles based on template
  const templateStyles = {
    '--primary-color': template.styles.colors.primary,
    '--secondary-color': template.styles.colors.secondary,
    '--accent-color': template.styles.colors.accent,
    '--text-color': template.styles.colors.text,
    '--heading-font': template.styles.typography.headingFont,
    '--body-font': template.styles.typography.bodyFont,
    '--h1-size': template.styles.typography.fontSize.h1,
    '--h2-size': template.styles.typography.fontSize.h2,
    '--h3-size': template.styles.typography.fontSize.h3,
    '--body-size': template.styles.typography.fontSize.body,
    '--section-gap': template.styles.spacing.sectionGap,
    '--item-gap': template.styles.spacing.itemGap,
    '--padding': template.styles.spacing.padding,
    // Headshot styling variables
    '--headshot-width': content.headshot?.styling?.width || '140px',
    '--headshot-height': content.headshot?.styling?.height || '175px',
    '--headshot-border-radius': content.headshot?.styling?.borderRadius || '8px',
    '--headshot-size': content.headshot?.shape === 'circular' ? '140px' : (content.headshot?.styling?.width || '140px'),
  } as React.CSSProperties;

  return (
    <div 
      className={`two-column-cv ${template.id}`}
      style={templateStyles}
    >

      {/* Header Section */}
      <div className="cv-header">
        <div className="cv-header-text">
          <h1 className="cv-name">{name}</h1>
          <div className="cv-title">{title}</div>
          {contactInfo.length > 0 && (
            <div className="cv-contact">
              {contactInfo.map((contact, index) => (
                <div key={index} className="contact-item">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <>{children}</>,
                      a: ({ href, children, ...props }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {contact}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {content.hasImage && content.headshot && (
          <Image
            src={validateImageUrl(content.headshot.src)}
            alt={content.headshot.alt}
            width={parseInt(String(content.headshot?.styling?.width ?? ''), 10) || 140}
            height={parseInt(String(content.headshot?.styling?.height ?? ''), 10) || 175}
            style={{
              borderRadius: content.headshot?.styling?.borderRadius || '8px',
              objectFit: 'cover',
              width: content.headshot?.styling?.width || '140px',
              height: content.headshot?.styling?.height || '175px',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
      </div>

      {/* Main Content (Left Column) */}
      <div className="cv-main-content">
        <div className="cv-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Don't render the first h1 (name) as it's in header
              h1: ({ children, ...props }) => {
                const text = children?.toString() || '';
                if (text === name) {
                  return null;
                }
                return <h1 className="cv-section-title" {...props}>{children}</h1>;
              },
              // Add section classes to h2 headers
              h2: ({ children, ...props }) => (
                <h2 className="cv-section-title" {...props}>{children}</h2>
              ),
              // Add section classes to h3 headers
              h3: ({ children, ...props }) => (
                <h3 className="cv-subsection-title" {...props}>{children}</h3>
              ),
              // Add item classes to h4 and h5 (job titles, education, etc.)
              h4: ({ children, ...props }) => (
                <h4 className="cv-item-title" {...props}>{children}</h4>
              ),
              h5: ({ children, ...props }) => (
                <h5 className="cv-item-subtitle" {...props}>{children}</h5>
              ),
              // Wrap paragraphs in cv-item class for better page breaks
              p: ({ children, ...props }) => (
                <p className="cv-text" {...props}>{children}</p>
              ),
              // Wrap lists in cv-item class
              ul: ({ children, ...props }) => (
                <ul className="cv-list" {...props}>{children}</ul>
              ),
              ol: ({ children, ...props }) => (
                <ol className="cv-list" {...props}>{children}</ol>
              ),
              li: ({ children, ...props }) => (
                <li className="cv-list-item" {...props}>{children}</li>
              ),
              // Don't render images as they're handled separately
              img: () => null,
              // Custom link rendering
              a: ({ href, children, ...props }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                  {children}
                </a>
              ),
            }}
          >
            {mainContent}
          </ReactMarkdown>
        </div>
      </div>

      {/* Sidebar (Right Column) */}
      <div className="cv-sidebar">
        <div className="cv-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Don't render h1 in sidebar
              h1: () => null,
              // Add section classes to h2 headers
              h2: ({ children, ...props }) => (
                <h2 className="cv-section-title" {...props}>{children}</h2>
              ),
              // Add section classes to h3 headers
              h3: ({ children, ...props }) => (
                <h3 className="cv-subsection-title" {...props}>{children}</h3>
              ),
              // Add item classes to h4 and h5
              h4: ({ children, ...props }) => (
                <h4 className="cv-item-title" {...props}>{children}</h4>
              ),
              h5: ({ children, ...props }) => (
                <h5 className="cv-item-subtitle" {...props}>{children}</h5>
              ),
              // Wrap paragraphs
              p: ({ children, ...props }) => (
                <p className="cv-text" {...props}>{children}</p>
              ),
              // Wrap lists
              ul: ({ children, ...props }) => (
                <ul className="cv-list" {...props}>{children}</ul>
              ),
              ol: ({ children, ...props }) => (
                <ol className="cv-list" {...props}>{children}</ol>
              ),
              li: ({ children, ...props }) => (
                <li className="cv-list-item" {...props}>{children}</li>
              ),
              // Don't render images
              img: () => null,
              // Custom link rendering
              a: ({ href, children, ...props }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                  {children}
                </a>
              ),
            }}
          >
            {sidebarContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
