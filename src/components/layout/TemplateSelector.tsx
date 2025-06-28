"use client";

import { useCVStore } from '@/lib/store';
import { getAllTemplates, getTemplate } from '@/lib/templates';
import { ChevronDown, Palette } from 'lucide-react';
import { useState } from 'react';

export function TemplateSelector() {
  const { template, setTemplate } = useCVStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const availableTemplates = getAllTemplates();
  const currentTemplate = getTemplate(template);

  const handleTemplateChange = (templateId: string) => {
    setTemplate(templateId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline">{currentTemplate.name}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 z-20 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="p-3 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-900">
                Choose Template
              </h3>
            </div>
            
            <div className="p-2 max-h-80 overflow-y-auto">
              {availableTemplates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleTemplateChange(tmpl.id)}
                  className={`w-full text-left p-3 rounded-md hover:bg-gray-50 transition-colors ${
                    tmpl.id === template ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Template Preview */}
                    <div 
                      className="w-12 h-16 rounded border flex-shrink-0"
                      style={{ 
                        backgroundColor: tmpl.styles.colors.primary,
                        opacity: 0.1 
                      }}
                    />
                    
                    {/* Template Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {tmpl.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {tmpl.description}
                      </p>
                      
                      {/* Color Indicators */}
                      <div className="flex space-x-1 mt-2">
                        <div 
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: tmpl.styles.colors.primary }}
                          title="Primary Color"
                        />
                        <div 
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: tmpl.styles.colors.accent }}
                          title="Accent Color"
                        />
                      </div>
                    </div>
                    
                    {tmpl.id === template && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
