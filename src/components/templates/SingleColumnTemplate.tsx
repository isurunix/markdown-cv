"use client";

import { extractName, extractTitle, validateImageUrl } from '@/lib/markdown';
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
      <style jsx>{`
        .single-column-cv {
          font-family: var(--body-font);
          color: var(--text-color);
          line-height: 1.4;
          padding: var(--padding);
          max-width: 8.5in;
          min-height: 11in;
          margin: 0 auto;
        }

        .cv-header {
          text-align: left;
          margin-bottom: var(--section-gap);
          position: relative;
        }

        .cv-name {
          font-family: var(--heading-font);
          font-size: var(--h1-size);
          font-weight: 700;
          color: var(--primary-color);
          margin: 0 0 4px 0;
          line-height: 1.2;
        }

        .cv-title {
          font-size: calc(var(--h3-size) * 1.2);
          color: var(--secondary-color);
          font-style: italic;
          margin: 0 0 16px 0;
        }

        .cv-headshot {
          float: right;
          width: 120px;
          height: 150px;
          margin: 0 0 16px 16px;
          border-radius: 4px;
          object-fit: cover;
          shape-outside: margin-box;
        }

        .cv-content :global(h2) {
          font-family: var(--heading-font);
          color: var(--primary-color);
          font-size: var(--h2-size);
          font-weight: 600;
          margin: var(--section-gap) 0 8px 0;
          padding-bottom: 4px;
          border-bottom: 2px solid var(--primary-color);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .cv-content :global(h3) {
          font-family: var(--heading-font);
          color: var(--text-color);
          font-size: var(--h3-size);
          font-weight: 600;
          margin: var(--item-gap) 0 4px 0;
        }

        .cv-content :global(p) {
          font-size: var(--body-size);
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .cv-content :global(ul) {
          margin: 8px 0;
          padding-left: 16px;
        }

        .cv-content :global(li) {
          font-size: var(--body-size);
          margin-bottom: 4px;
          line-height: 1.4;
        }

        .cv-content :global(strong) {
          color: var(--text-color);
          font-weight: 600;
        }

        .cv-content :global(a) {
          color: var(--accent-color);
          text-decoration: none;
        }

        .cv-content :global(a:hover) {
          text-decoration: underline;
        }

        /* Template-specific styles */
        .classic-professional .cv-content :global(h2) {
          border-bottom: 2px solid var(--primary-color);
        }

        .modern-minimalist .cv-name {
          font-weight: 300;
          letter-spacing: -0.5px;
        }

        .modern-minimalist .cv-content :global(h2) {
          border-bottom: none;
          padding-bottom: 0;
        }

        .modern-minimalist .cv-headshot {
          border-radius: 50%;
          width: 100px;
          height: 125px;
        }

        /* Print styles */
        @media print {
          .single-column-cv {
            padding: 0.5in;
            font-size: 11px;
          }
          
          .cv-content :global(h1) {
            font-size: 24px;
          }
          
          .cv-content :global(h2) {
            font-size: 14px;
          }
          
          .cv-content :global(h3) {
            font-size: 12px;
          }
        }
      `}</style>

      {/* Header Section */}
      <div className="cv-header">
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
        
        <h1 className="cv-name">{name}</h1>
        <div className="cv-title">{title}</div>
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
