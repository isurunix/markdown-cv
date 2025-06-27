"use client";

import { useCVStore } from '@/lib/store';
import { Download, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function ExportButton() {
  const { isExporting, setExporting, markdown, layout, template } = useCVStore();
  const [exportFormat, setExportFormat] = useState<'standard' | 'ats'>('standard');

  const handleExport = async (format: 'standard' | 'ats') => {
    try {
      setExporting(true);
      
      // TODO: Implement PDF generation API call
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: markdown,
          layout: format === 'ats' ? 'single-column' : layout,
          template: template,
          format: format,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `cv-${format}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      // TODO: Show error toast
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Quick Export */}
      <button
        onClick={() => handleExport('standard')}
        disabled={isExporting}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">Export PDF</span>
      </button>

      {/* Export Options Dropdown */}
      <div className="relative group">
        <button
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          title="Export Options"
        >
          <FileText className="w-4 h-4" />
        </button>

        {/* Dropdown Menu */}
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
          <div className="p-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">Export Options</h3>
          </div>
          
          <div className="p-2">
            <button
              onClick={() => handleExport('standard')}
              disabled={isExporting}
              className="w-full text-left p-2 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
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
              className="w-full text-left p-2 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
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
      </div>
    </div>
  );
}
