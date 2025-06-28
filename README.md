# Markdown CV Builder

A modern, responsive web application for creating professional CVs/resumes using Markdown with real-time preview and ATS-friendly PDF export.

## ✨ Features

- **📝 Monaco Editor**: VS Code-like editing experience with syntax highlighting
- **👁️ Live Preview**: Real-time CV rendering as you type
- **📱 Responsive Design**: Split-view on desktop, tabbed on mobile
- **🎨 Multiple Templates**: Professional templates for different industries
- **📐 Two Layout Options**: Single-column (ATS-friendly) and two-column (modern)
- **🖼️ Image Support**: Professional headshots via markdown image links
- **💾 Auto-save**: Automatic local storage persistence
- **🎯 Export Ready**: PDF export functionality (in development)

## 🚀 Quick Start

```bash
# Clone and install
git clone <your-repo-url>
cd markdown-cv
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start building your CV!

## 📊 Current Status

### ✅ Completed Features
- ✅ **Project Setup**: Next.js 14, TypeScript, Tailwind CSS
- ✅ **Monaco Editor**: Full markdown editor with snippets and shortcuts
- ✅ **Template System**: Multiple professional templates
- ✅ **Layout System**: Single-column and two-column layouts
- ✅ **Image Processing**: Automatic headshot detection and positioning
- ✅ **Responsive UI**: Mobile-friendly interface with tab switching
- ✅ **State Management**: Zustand store with local storage
- ✅ **CSS Architecture**: Organized, maintainable stylesheets
- ✅ **Template Rendering**: Professional CV templates with theming

### 🚧 In Progress
- 🔄 **PDF Export**: API endpoint and generation logic
- 🔄 **Error Handling**: User feedback and error states

### 📋 Upcoming Features
- 📋 **Multiple CV Management**: Save and manage multiple CVs
- 📋 **Template Gallery**: More professional templates
- 📋 **Enhanced Export**: Multiple formats and ATS optimization
- 📋 **Theme Customization**: Color and typography options

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **Editor**: Monaco Editor (VS Code)
- **State**: Zustand
- **Markdown**: react-markdown + remark plugins
- **Layout**: Allotment (split panes)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/             # React components
│   ├── editor/            # Markdown editor
│   ├── layout/            # Header, controls, navigation
│   ├── preview/           # CV preview
│   └── templates/         # CV template components
├── lib/                   # Utilities and logic
├── styles/                # CSS files
└── types/                 # TypeScript definitions
```

## 📖 Usage

1. **Write**: Use the Monaco editor with markdown syntax
2. **Preview**: See real-time CV rendering
3. **Customize**: Switch layouts and templates
4. **Export**: Generate PDF (coming soon)

### Markdown Tips

- Use `# Your Name` for the main heading
- Add `**Your Title**` for your job title
- Include images: `![Headshot](image-url)`
- Use `## Section` for main sections
- Use `### Job Title | Company` for experience items

## 🎨 Templates

- **Classic Professional**: Traditional black & white
- **Modern Minimalist**: Clean, contemporary design
- **Executive Two-Column**: Premium layout for senior roles
- **Tech Professional**: Developer-focused styling

## 📚 Documentation

- [📋 Project Plan](./PLAN.md) - Detailed development plan
- [🎯 Features](./docs/FEATURES.md) - Comprehensive feature specifications
- [🎨 Templates](./docs/TEMPLATES.md) - Template design guidelines
- [🚀 Deployment](./docs/DEPLOYMENT.md) - Deployment instructions

## 🤝 Contributing

Contributions welcome! Please read the project plan and documentation before submitting PRs.

## 📄 License

MIT License

---

**Built for professionals who love markdown** ❤️
