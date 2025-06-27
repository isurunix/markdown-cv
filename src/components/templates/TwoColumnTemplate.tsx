"use client";

import { extractName, extractTitle, splitContentForTwoColumn, validateImageUrl } from '@/lib/markdown';
import { Template } from '@/types/cv';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TwoColumnTemplateProps {
  content: {
    headshot: any;
    content: string;
    hasImage: boolean;
  };
  template: Template;
  zoom: number;
}

export function TwoColumnTemplate({ content, template, zoom }: TwoColumnTemplateProps) {
  const name = extractName(content.content);
  const title = extractTitle(content.content);
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
  } as React.CSSProperties;

  return (
    <div 
      className={`two-column-cv ${template.id}`}
      style={templateStyles}
    >
      <style jsx>{`
        .two-column-cv {
          font-family: var(--body-font);
          color: var(--text-color);
          line-height: 1.4;
          padding: var(--padding);
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 28px;
          max-width: 8.5in;
          min-height: 11in;
          margin: 0 auto;
        }

        .main-content {
          /* Left column */
        }

        .sidebar {
          /* Right column */
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          height: fit-content;
        }

        .cv-header {
          grid-column: 1 / -1;
          margin-bottom: var(--section-gap);
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .cv-header-text {
          flex: 1;
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
          margin: 0;
        }

        .cv-headshot {
          width: 140px;
          height: 175px;
          border-radius: 8px;
          object-fit: cover;
          margin-left: 20px;
          flex-shrink: 0;
        }

        .cv-content :global(h2) {
          font-family: var(--heading-font);
          color: var(--accent-color);
          font-size: var(--h2-size);
          font-weight: 600;
          margin: var(--section-gap) 0 12px 0;
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

        /* Sidebar specific styles */
        .sidebar .cv-content :global(h2) {
          margin-top: 16px;
          font-size: calc(var(--h2-size) * 0.9);
        }

        .sidebar .cv-content :global(h2:first-child) {
          margin-top: 0;
        }

        .sidebar .cv-content :global(p),
        .sidebar .cv-content :global(li) {
          font-size: calc(var(--body-size) * 0.95);
        }

        /* Template-specific styles */
        .executive-two-column .sidebar {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border-left: 4px solid var(--accent-color);
        }

        .tech-professional .sidebar {
          background: #f1f5f9;
          border-left: 4px solid var(--accent-color);
        }

        .tech-professional .cv-headshot {
          border-radius: 12px;
        }

        .tech-professional .cv-content :global(.tech-skills) {
          font-family: 'Fira Code', 'Consolas', monospace;
          font-size: calc(var(--body-size) * 0.9);
          background: #f8fafc;
          padding: 8px;
          border-radius: 4px;
          border-left: 3px solid var(--accent-color);
        }

        /* Print styles */
        @media print {
          .two-column-cv {
            padding: 0.5in;
            gap: 16px;
            font-size: 10px;
          }
          
          .cv-content :global(h1) {
            font-size: 22px;
          }
          
          .cv-content :global(h2) {
            font-size: 12px;
          }
          
          .cv-content :global(h3) {
            font-size: 11px;
          }

          .sidebar {
            padding: 16px;
          }

          .cv-headshot {
            width: 120px;
            height: 150px;
          }
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .two-column-cv {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .cv-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .cv-headshot {
            margin: 16px 0 0 0;
            width: 120px;
            height: 150px;
          }
        }
      `}</style>

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
