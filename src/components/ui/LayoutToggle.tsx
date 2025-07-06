"use client";

import { useCVStore } from '@/lib/store';
import { Columns, Rows } from 'lucide-react';

export function LayoutToggle() {
  const { layout, setLayout } = useCVStore();

  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setLayout('single-column')}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          layout === 'single-column'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        title="Single Column Layout (ATS-friendly)"
      >
        <Rows className="w-4 h-4" />
        <span className="hidden sm:inline">Single</span>
      </button>
      <button
        onClick={() => setLayout('two-column')}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          layout === 'two-column'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        title="Two Column Layout (Modern)"
      >
        <Columns className="w-4 h-4" />
        <span className="hidden sm:inline">Two Column</span>
      </button>
    </div>
  );
}
