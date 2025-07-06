"use client";

import { PDFGenerator } from '@/lib/pdf/PDFGenerator';
import { useCVStore } from '@/lib/store';
import { ChevronDown, Download, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function ExportButton() {
  const { isExporting, setExporting, pageFormat } = useCVStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = async (format: 'standard' | 'ats') => {
    try {
      setExporting(true);
      setIsOpen(false); // Close dropdown
      
      // Get the CV preview element - prefer the hidden export element
      let previewElement = document.querySelector('.cv-pdf-export') as HTMLElement;
      
      // If not found, try the visible preview content
      if (!previewElement) {
        previewElement = document.querySelector('.cv-preview-content') as HTMLElement;
      }
      
      // If still not found, try the pages view
      if (!previewElement) {
        previewElement = document.querySelector('.cv-preview-pages .cv-preview-page:first-child') as HTMLElement;
      }
      
      // If still not found, try any element with CV content
      if (!previewElement) {
        previewElement = document.querySelector('[class*="cv-preview"]') as HTMLElement;
      }
      
      if (!previewElement) {
        throw new Error('CV preview not found. Please ensure the CV is loaded and try switching to single view mode.');
      }

      // Generate PDF using our client-side service
      const result = format === 'ats' 
        ? await PDFGenerator.generateATSPDF(previewElement, pageFormat)
        : await PDFGenerator.generateStandardPDF(previewElement, pageFormat);

      if (!result.success) {
        throw new Error(result.error || 'PDF generation failed');
      }

      // Show success feedback (optional)
      console.log(`PDF generated successfully: ${result.pageCount} pages, ${Math.round((result.fileSize || 0) / 1024)}KB`);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="relative">
      {/* Main Export Button with Dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">Export PDF</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 z-20 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="p-3 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-900">Export Options</h3>
            </div>
            
            <div className="p-2">
              <button
                onClick={() => handleExport('standard')}
                disabled={isExporting}
                className="w-full text-left p-3 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <Download className="w-4 h-4 mt-0.5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Standard PDF</p>
                    <p className="text-xs text-gray-500">
                      Full layout with images and styling
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleExport('ats')}
                disabled={isExporting}
                className="w-full text-left p-3 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <FileText className="w-4 h-4 mt-0.5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">ATS-Friendly PDF</p>
                    <p className="text-xs text-gray-500">
                      Single column, text-optimized for applicant tracking systems
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
