"use client";

import { extractName, extractTitle, validateImageUrl } from '@/lib/markdown';
import '@/styles/single-column.css';
import { Template } from '@/types/cv';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SingleColumnTemplateProps {
  content: {
    headshot: any;
    content: string;
    hasImage: boolean;
  };
  template: Template;
  zoom: number;
}

export function SingleColumnTemplate({ content, template, zoom }: SingleColumnTemplateProps) {
  const name = extractName(content.content);
  const title = extractTitle(content.content);
  
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
  } as React.CSSProperties;

  return (
    <div 
      className={`single-column-cv ${template.id}`}
      style={templateStyles}
    >

      {/* Header Section */}
      <div className="cv-header">
        <div className="cv-header-text">
          <h1 className="cv-name">{name}</h1>
          <div className="cv-title">{title}</div>
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

      {/* CV Content */}
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
          {content.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
