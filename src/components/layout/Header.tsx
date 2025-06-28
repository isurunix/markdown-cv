"use client";

import { ExportButton } from './ExportButton';
import { LayoutToggle } from './LayoutToggle';
import { TemplateSelector } from './TemplateSelector';

export function Header() {

  return (
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

      {/* Center Controls */}
      <div className="hidden md:flex items-center space-x-4">
        <LayoutToggle />
        <TemplateSelector />
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3">
        <ExportButton />
      </div>
    </header>
  );
}
