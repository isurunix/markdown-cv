# Markdown CV/Resume Builder

A modern web application that allows users to create, edit, and preview CVs/resumes in markdown format with real-time rendering and PDF export capabilities that are ATS (Applicant Tracking System) friendly.

## 🎯 Project Overview

This application enables users to:
- Write CVs/resumes in markdown format with live preview
- Choose between single-column (ATS-friendly) and two-column (modern) layouts
- Include professional headshots via markdown image links
- Export to PDF with ATS optimization
- Maintain full portability of CV data

## 🏗️ Technology Stack

### Core Technologies
- **Next.js 14** (App Router) - Full-stack React framework
- **React 18** - UI library
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern UI component library

### Markdown & Export
- **react-markdown** - Markdown rendering with custom components
- **remark/rehype plugins** - Advanced markdown processing
- **Puppeteer** - PDF generation from HTML
- **react-syntax-highlighter** - Code syntax highlighting (if needed)

### Editor & UI
- **Monaco Editor** - Professional code editor (VS Code editor)
- **react-split-pane** - Resizable split-view layout
- **Zustand** - Lightweight state management
- **localStorage** - Client-side data persistence

## 🎨 Key Features

### ✅ Phase 1: MVP (Minimum Viable Product)
- [ ] **Markdown Editor**: Live editor with syntax highlighting
- [ ] **Real-time Preview**: Instant CV preview as you type
- [ ] **Split Layout**: Editor on left, preview on right
- [ ] **Two Layout Options**: Single-column and two-column layouts
- [ ] **Image Support**: Professional headshots via markdown links
- [ ] **PDF Export**: Generate ATS-friendly PDFs
- [ ] **Local Storage**: Auto-save and persist drafts
- [ ] **Responsive Design**: Mobile and desktop support

### 🚀 Phase 2: Enhanced Features
- [ ] **Multiple Templates**: Professional CV templates for each layout
- [ ] **Dark/Light Mode**: Theme switching
- [ ] **Export Options**: Multiple PDF formats and HTML export
- [ ] **Template Customization**: Color schemes and typography
- [ ] **Markdown Shortcuts**: Quick formatting tools

### 🌟 Phase 3: Advanced Features
- [ ] **Version History**: Track CV changes over time
- [ ] **Shareable Links**: Public preview URLs
- [ ] **Print Optimization**: Perfect print layouts
- [ ] **Import/Export**: JSON, HTML, and other formats

## 📁 Project Structure

```
markdown-cv/
├── README.md                    # This file
├── PLAN.md                      # Detailed project plan
├── docs/                        # Documentation
│   ├── FEATURES.md              # Feature specifications
│   ├── TEMPLATES.md             # Template guidelines
│   └── DEPLOYMENT.md            # Deployment guide
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Main CV builder page
│   │   └── api/                 # API routes
│   │       └── pdf/             # PDF generation endpoint
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui base components
│   │   ├── editor/              # Markdown editor components
│   │   ├── preview/             # CV preview components
│   │   ├── layout/              # Layout management
│   │   └── templates/           # CV template components
│   ├── lib/                     # Utility functions
│   │   ├── markdown.ts          # Markdown processing
│   │   ├── pdf.ts               # PDF generation logic
│   │   ├── templates.ts         # Template management
│   │   └── utils.ts             # General utilities
│   ├── hooks/                   # Custom React hooks
│   │   ├── useLocalStorage.ts   # Local storage management
│   │   └── useMarkdown.ts       # Markdown processing hook
│   ├── styles/                  # Additional stylesheets
│   ├── types/                   # TypeScript type definitions
│   │   └── cv.ts                # CV data types
│   └── constants/               # Application constants
├── public/                      # Static assets
│   ├── templates/               # Template preview images
│   └── examples/                # Sample CV files
└── package.json                 # Dependencies and scripts
```

## 🎨 Layout System

### Single-Column Layout (ATS-Friendly)
- Traditional resume format
- Optimized for Applicant Tracking Systems
- Image displayed inline with content
- Maximum compatibility with ATS parsers

### Two-Column Layout (Modern)
- **Left Column (70% width)**: Main content
  - Professional Summary
  - Work Experience
  - Projects
- **Right Column (30% width)**: Supplementary info
  - Professional Headshot
  - Contact Information
  - Skills
  - Education
  - Certifications

## 🖼️ Image Handling Strategy

### Markdown Image Links Approach
Instead of complex file uploads, users reference images via URLs:

```markdown
![Professional Headshot](https://your-image-url.com/headshot.jpg)
```

### Benefits
- ✅ **Simplicity**: No server-side storage needed
- ✅ **Portability**: CV files are self-contained
- ✅ **Flexibility**: Use any image hosting service
- ✅ **Performance**: No upload processing overhead
- ✅ **Version Control**: Images referenced, not embedded

### Recommended Image Sources
- LinkedIn profile photos
- GitHub avatars
- Cloud storage (Google Drive, Dropbox)
- Professional photo hosting services

## 📄 CV Markdown Structure

### Standard Format
```markdown
# Full Name
**Job Title/Position**

![Professional Headshot](https://your-image-url.com/photo.jpg)

## Contact Information
- 📧 email@example.com
- 📱 +1-234-567-8900
- 🔗 [LinkedIn](https://linkedin.com/in/username)
- 📍 City, State, Country

## Professional Summary
Brief 2-3 sentence summary of experience and key strengths...

## Experience
### Job Title | Company Name
**Start Date - End Date | Location**
- Achievement or responsibility with quantifiable results
- Another achievement demonstrating impact
- Third bullet point showcasing skills

### Previous Job Title | Previous Company
**Start Date - End Date | Location**
- Similar format for previous roles

## Skills
- **Technical**: Skill1, Skill2, Skill3
- **Languages**: Language1 (Native), Language2 (Fluent)
- **Certifications**: Cert1, Cert2

## Education
### Degree | Institution Name
**Graduation Year | Location**
- Relevant details (GPA, honors, relevant coursework)

## Projects (Optional)
### Project Name
**Technologies Used**
- Brief description of the project and your role
- Key achievements or learnings
```

## 🎯 PDF Export Strategy

### ATS Optimization
- **Semantic HTML**: Proper heading hierarchy (h1, h2, h3)
- **Clean Structure**: No complex layouts that confuse parsers
- **Standard Fonts**: Arial, Helvetica, Times for maximum compatibility
- **Text-based**: All content as selectable text, not images

### Export Options
1. **Standard PDF**: Full layout with images
2. **ATS-Friendly PDF**: Single-column, text-optimized
3. **Print PDF**: Optimized for physical printing

## 🚀 Development Roadmap

### Week 1: Foundation Setup
- [x] Project initialization and configuration
- [ ] Next.js setup with TypeScript and Tailwind
- [ ] Basic project structure and routing
- [ ] shadcn/ui integration

### Week 2: Core Editor
- [ ] Monaco Editor integration
- [ ] Split-pane layout implementation
- [ ] Basic markdown rendering
- [ ] Local storage persistence

### Week 3: Layout System
- [ ] Single-column template
- [ ] Two-column template
- [ ] Layout switching functionality
- [ ] Image rendering in both layouts

### Week 4: PDF Export & Polish
- [ ] Puppeteer PDF generation
- [ ] ATS optimization
- [ ] Responsive design improvements
- [ ] Testing and bug fixes

## 📊 Success Criteria

### MVP Requirements
- [ ] Functional markdown editor with live preview
- [ ] Both single and two-column layouts working
- [ ] Image support via markdown links
- [ ] PDF export functionality
- [ ] Mobile-responsive design
- [ ] Local storage auto-save

### Quality Standards
- [ ] Page load time < 2 seconds
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] ATS-friendly PDF output validation
- [ ] Mobile-first responsive design

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser
- Basic understanding of Markdown

### Installation
```bash
git clone <repository-url>
cd markdown-cv
npm install
npm run dev
```

### Usage
1. Open the application in your browser
2. Start typing your CV in markdown format
3. See real-time preview on the right
4. Switch between single and two-column layouts
5. Export to PDF when ready

## 🤝 Contributing

Please read our contributing guidelines and code of conduct before submitting pull requests.

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ for developers and professionals who love markdown.**
