"use client";

import { debounce } from '@/lib/markdown';
import { useCVStore } from '@/lib/store';
import Editor from '@monaco-editor/react';
import { useEffect, useRef } from 'react';

export function MarkdownEditor() {
  const { markdown, setMarkdown, darkMode } = useCVStore();
  const editorRef = useRef<any>(null);

  // Debounced save function to prevent excessive updates
  const debouncedSetMarkdown = debounce(setMarkdown, 300);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Configure Monaco Editor for markdown
    monaco.languages.setLanguageConfiguration('markdown', {
      wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
    });

    // Add custom markdown snippets
    monaco.languages.registerCompletionItemProvider('markdown', {
      provideCompletionItems: (model: any, position: any) => {
        const suggestions = [
          {
            label: 'cv-header',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              '# ${1:Your Name}',
              '**${2:Your Title}**',
              '',
              '![Professional Headshot](${3:image-url})',
              '',
              '## Contact Information',
              '- 📧 ${4:email@example.com}',
              '- 📱 ${5:+1-234-567-8900}',
              '- 🔗 [LinkedIn](${6:linkedin-url})',
              '- 📍 ${7:City, State}',
              ''
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'CV Header template with contact info'
          },
          {
            label: 'cv-experience-item',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              '### ${1:Job Title} | ${2:Company Name}',
              '**${3:Start Date} - ${4:End Date} | ${5:Location}**',
              '- ${6:Achievement or responsibility}',
              '- ${7:Another achievement}',
              '- ${8:Third achievement}',
              ''
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Work experience item template'
          },
          {
            label: 'cv-skills-section',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: [
              '## Skills',
              '- **${1:Category}:** ${2:Skill1, Skill2, Skill3}',
              '- **${3:Category}:** ${4:Skill1, Skill2, Skill3}',
              '- **${5:Category}:** ${6:Skill1, Skill2, Skill3}',
              ''
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Skills section template'
          }
        ];
        return { suggestions };
      }
    });

    // Focus editor on mount
    editor.focus();
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      debouncedSetMarkdown(value);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save (already auto-saving, but good UX)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Could trigger explicit save or show save confirmation
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-medium text-gray-900">Markdown Editor</h2>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>Auto-saved</span>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="markdown"
          value={markdown}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme={darkMode ? 'vs-dark' : 'vs'}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 1.5,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            folding: true,
            lineNumbers: 'on',
            glyphMargin: false,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: 12,
              horizontalScrollbarSize: 12,
            },
            suggest: {
              showKeywords: true,
              showSnippets: true,
            },
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false
            },
            parameterHints: {
              enabled: true
            },
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
          }}
        />
      </div>

      {/* Editor Help */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>💡 Type "cv-" for templates</span>
            <span>📝 Markdown supported</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Ctrl+S: Save</span>
            <span>•</span>
            <span>Lines: {markdown.split('\n').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
