"use client";

import { useCVStore } from '@/lib/store';
import { Edit, Eye } from 'lucide-react';

export function MobileToggle() {
  const { editorVisible, previewVisible, toggleEditor, togglePreview } = useCVStore();

  return (
    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center bg-gray-100 rounded-lg p-1">
        <button
          onClick={toggleEditor}
          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            editorVisible
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          <Edit className="w-4 h-4" />
          <span>Editor</span>
        </button>
        <button
          onClick={togglePreview}
          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            previewVisible
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Preview</span>
        </button>
      </div>
    </div>
  );
}
