"use client";

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ExportButton } from './ExportButton';
import { LayoutToggle } from './LayoutToggle';
import { TemplateSelector } from './TemplateSelector';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Markdown CV Builder</h1>
            </div>
          </div>
        </div>

        {/* Right Actions - Rendering Controls and Export */}
        <div className="flex items-center space-x-3">
          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-3">
            <LayoutToggle />
            <TemplateSelector />
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            title="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <ExportButton />
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Layout</h3>
              <LayoutToggle />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Template</h3>
              <TemplateSelector />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
