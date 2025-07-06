"use client";

import { SingleColumnTemplate } from '@/components/templates/SingleColumnTemplate';
import { TwoColumnTemplate } from '@/components/templates/TwoColumnTemplate';
import { processMarkdownForCV } from '@/lib/markdown';
import { useCVStore } from '@/lib/store';
import { getTemplate } from '@/lib/templates';
import '@/styles/pdf.css';
import { Eye, FileText, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function CVPreview() {
  const { markdown, layout, template, pageFormat, setPageFormat } = useCVStore();
  const [zoom, setZoom] = useState(100);
  const [pageCount, setPageCount] = useState(1);
  const [viewMode, setViewMode] = useState<'single' | 'pages'>('single');
  const previewRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);
  
  const currentTemplate = getTemplate(template);
  const processedContent = processMarkdownForCV(markdown, layout);

  // Page format configurations
  const pageFormats = {
    'US Letter': { 
      width: '8.5in', 
      height: '11in', 
      label: '📄 US Letter (8.5" × 11")', 
      heightPx: 792 // 11in * 72dpi (more accurate for print layouts)
    },
    'A4': { 
      width: '8.27in', 
      height: '11.7in', 
      label: '📄 A4 (210 × 297mm)', 
      heightPx: 842 // 11.7in * 72dpi 
    }
  };

  const currentPageFormat = pageFormats[pageFormat];

  // Calculate page count based on content height
  useEffect(() => {
    const calculatePageCount = () => {
      const element = viewMode === 'single' ? previewRef.current : previewRef.current;
      if (element) {
        const computedStyle = window.getComputedStyle(element);
        const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
        const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
        
        const contentHeight = element.scrollHeight;
        const pageHeight = currentPageFormat.heightPx;
        
        // Account for padding and margins in the calculation
        const effectivePageHeight = pageHeight - paddingTop - paddingBottom;
        const calculatedPages = Math.ceil(contentHeight / effectivePageHeight);
        setPageCount(Math.max(1, calculatedPages));
      }
    };

    // Initial calculation with a delay to allow for rendering
    const timer = setTimeout(calculatePageCount, 200);

    // Set up ResizeObserver to recalculate when content changes
    const resizeObserver = new ResizeObserver(() => {
      // Add a small delay to allow for layout changes to complete
      setTimeout(calculatePageCount, 50);
    });
    
    // Observe the appropriate element based on view mode
    const elementToObserve = viewMode === 'single' ? previewRef.current : previewRef.current;
    if (elementToObserve) {
      resizeObserver.observe(elementToObserve);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [markdown, layout, template, pageFormat, zoom, viewMode, currentPageFormat.heightPx]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handleZoomReset = () => setZoom(100);
  const toggleViewMode = () => setViewMode(prev => prev === 'single' ? 'pages' : 'single');

  const renderTemplate = () => {
    if (layout === 'two-column') {
      return (
        <TwoColumnTemplate
          content={processedContent}
          originalMarkdown={markdown}
          template={currentTemplate}
          zoom={zoom}
        />
      );
    } else {
      return (
        <SingleColumnTemplate
          content={processedContent}
          originalMarkdown={markdown}
          template={currentTemplate}
          zoom={zoom}
        />
      );
    }
  };

  const renderPages = () => {
    const pages = [];
    const pageHeightInches = pageFormat === 'A4' ? 11.7 : 11;
    const pageHeightPx = pageHeightInches * 72; // Use 72 DPI for better accuracy
    
    for (let i = 0; i < pageCount; i++) {
      pages.push(
        <div
          key={i}
          className="cv-preview-page bg-white shadow-lg mb-6 relative overflow-hidden"
          style={{
            width: currentPageFormat.width,
            height: currentPageFormat.height,
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            margin: zoom !== 100 ? `0 ${Math.abs(100 - zoom) * 2}px ${zoom !== 100 ? '1.5rem' : '1.5rem'} ${Math.abs(100 - zoom) * 2}px` : '0 0 1.5rem 0'
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              top: `-${i * pageHeightPx}px`,
              height: `${pageCount * pageHeightPx}px`,
              overflow: 'hidden'
            }}
          >
            {renderTemplate()}
          </div>
          {/* Page number indicator */}
          <div className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            Page {i + 1}
          </div>
        </div>
      );
    }
    
    return pages;
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Preview Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-900">CV Preview</h2>
        
        {/* View Mode and Zoom Controls */}
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <button
            onClick={toggleViewMode}
            className={`flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
              viewMode === 'pages' 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title={viewMode === 'single' ? 'Show Page Breaks' : 'Hide Page Breaks'}
          >
            {viewMode === 'single' ? <FileText className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            <span>{viewMode === 'single' ? 'Show Pages' : 'Single View'}</span>
          </button>
          
          {/* Zoom Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleZoomReset}
              className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              title="Reset Zoom"
            >
              {zoom}%
            </button>
            
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex justify-center">
          {viewMode === 'single' ? (
            <div 
              ref={previewRef}
              className="cv-preview-content bg-white shadow-lg"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                width: currentPageFormat.width,
                minHeight: currentPageFormat.height,
                margin: zoom !== 100 ? `0 ${Math.abs(100 - zoom) * 2}px` : '0'
              }}
            >
              {renderTemplate()}
            </div>
          ) : (
            <div 
              ref={pagesRef}
              className="cv-preview-pages"
              style={{
                width: 'fit-content'
              }}
            >
              {renderPages()}
            </div>
          )}
        </div>
        
        {/* Hidden single view for PDF export - always rendered for export purposes */}
        <div 
          className="cv-preview-content cv-pdf-export"
          style={{
            position: 'absolute',
            left: '-10000px',
            top: '-10000px',
            width: currentPageFormat.width,
            minHeight: currentPageFormat.height,
            visibility: 'hidden',
            pointerEvents: 'none',
            backgroundColor: 'white',
            overflow: 'visible',
            transform: 'none',
            scale: 'none',
            zIndex: -1
          }}
        >
          {renderTemplate()}
        </div>
      </div>

      {/* Footer with PDF Info */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-end text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <select
              value={pageFormat}
              onChange={(e) => setPageFormat(e.target.value as 'A4' | 'US Letter')}
              className="bg-transparent border-none text-xs text-gray-500 cursor-pointer hover:text-gray-700 focus:outline-none"
            >
              <option value="US Letter">📄 US Letter (8.5" × 11")</option>
              <option value="A4">📄 A4 (210 × 297mm)</option>
            </select>
            <span>📝 {pageCount} page{pageCount !== 1 ? 's' : ''}{viewMode === 'pages' ? ' (Multi-page view)' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
