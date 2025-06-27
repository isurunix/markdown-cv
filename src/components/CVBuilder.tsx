"use client";

import { Allotment } from 'allotment';
import "allotment/dist/style.css";
import { useEffect, useState } from 'react';

import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { Header } from '@/components/layout/Header';
import { MobileToggle } from '@/components/layout/MobileToggle';
import { CVPreview } from '@/components/preview/CVPreview';
import { useCVStore } from '@/lib/store';

export function CVBuilder() {
  const { editorVisible, previewVisible } = useCVStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Mobile Toggle */}
      {isMobile && <MobileToggle />}
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {isMobile ? (
          // Mobile: Show either editor or preview
          <div className="h-full">
            {editorVisible && <MarkdownEditor />}
            {previewVisible && <CVPreview />}
          </div>
        ) : (
          // Desktop: Split view with resizable panes
          <Allotment>
            {editorVisible && (
              <Allotment.Pane minSize={300}>
                <MarkdownEditor />
              </Allotment.Pane>
            )}
            {previewVisible && (
              <Allotment.Pane minSize={400}>
                <CVPreview />
              </Allotment.Pane>
            )}
          </Allotment>
        )}
      </div>
    </div>
  );
}
