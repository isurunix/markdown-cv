"use client";

import { extractContactInfo, extractName, extractTitle, splitContentForTwoColumn, validateImageUrl } from '@/lib/markdown';
import '@/styles/two-column.css';
import { Template } from '@/types/cv';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TwoColumnTemplateProps {
  content: {
    headshot: any;
    content: string;
    hasImage: boolean;
  };
  originalMarkdown: string;
  template: Template;
  zoom: number;
}

export function TwoColumnTemplate({ content, originalMarkdown, template, zoom }: TwoColumnTemplateProps) {
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
          <img
            src={validateImageUrl(content.headshot.src)}
            alt={content.headshot.alt}
            className="cv-headshot"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
      </div>

      {/* Main Content (Left Column) */}
      <div className="main-content">
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
                return <h1 {...props}>{children}</h1>;
              },
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
      <div className="sidebar">
        <div className="cv-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Don't render h1 in sidebar
              h1: () => null,
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
