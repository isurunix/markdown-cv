"use client";

import { SingleColumnTemplate } from '@/components/templates/SingleColumnTemplate';
import { TwoColumnTemplate } from '@/components/templates/TwoColumnTemplate';
import { processMarkdownForCV } from '@/lib/markdown';
import { useCVStore } from '@/lib/store';
import { getTemplate } from '@/lib/templates';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';

export function CVPreview() {
  const { markdown, layout, template, pageFormat, setPageFormat } = useCVStore();
  const [zoom, setZoom] = useState(100);
  
  const currentTemplate = getTemplate(template);
  const processedContent = processMarkdownForCV(markdown, layout);

  // Page format configurations
  const pageFormats = {
    'US Letter': { width: '8.5in', height: '11in', label: '📄 US Letter (8.5" × 11")' },
    'A4': { width: '8.27in', height: '11.7in', label: '📄 A4 (210 × 297mm)' }
  };

  const currentPageFormat = pageFormats[pageFormat];

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handleZoomReset = () => setZoom(100);

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

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Preview Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-900">CV Preview</h2>
        
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

      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex justify-center">
          <div 
            className="bg-white shadow-lg"
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
            <span>📝 1 page</span>
          </div>
        </div>
      </div>
    </div>
  );
}
