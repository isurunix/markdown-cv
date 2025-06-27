import { CVState } from '@/types/cv';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Default CV content
const DEFAULT_CV_CONTENT = `# John Doe
**Senior Software Engineer**

![Professional Headshot](https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face)

## Contact Information
- 📧 john.doe@email.com
- 📱 +1-234-567-8900
- 🔗 [LinkedIn](https://linkedin.com/in/johndoe)
- 📍 San Francisco, CA

## Professional Summary
Experienced software engineer with 8+ years developing scalable web applications and leading cross-functional teams. Passionate about creating efficient, maintainable code and mentoring junior developers.

## Experience

### Senior Software Engineer | TechCorp Inc.
**Jan 2020 - Present | San Francisco, CA**
- Led development of microservices architecture serving 1M+ users
- Increased system performance by 40% through optimization initiatives
- Mentored team of 5 junior developers and conducted code reviews
- Implemented CI/CD pipelines reducing deployment time by 60%

### Software Engineer | StartupXYZ
**Jun 2018 - Dec 2019 | San Francisco, CA**
- Developed full-stack web applications using React and Node.js
- Collaborated with design team to implement responsive user interfaces
- Built RESTful APIs and integrated third-party services
- Participated in agile development process and sprint planning

### Junior Developer | WebSolutions Ltd.
**Aug 2016 - May 2018 | San Francisco, CA**
- Maintained and enhanced existing web applications
- Fixed bugs and implemented new features based on client requirements
- Learned best practices for version control and code documentation

## Skills
- **Frontend:** React, TypeScript, Next.js, Tailwind CSS, Vue.js
- **Backend:** Node.js, Python, Express.js, PostgreSQL, MongoDB
- **Cloud:** AWS, Docker, Kubernetes, CI/CD, Terraform
- **Tools:** Git, Jest, Cypress, Figma, Jira

## Education

### B.S. Computer Science | Stanford University
**2016 | Stanford, CA**
- Graduated Magna Cum Laude (GPA: 3.8/4.0)
- Relevant Coursework: Data Structures, Algorithms, Software Engineering
- Dean's List: 2014, 2015, 2016

## Projects

### Personal Portfolio Website
**Technologies:** Next.js, TypeScript, Tailwind CSS
- Built responsive portfolio showcasing projects and skills
- Implemented dark mode toggle and smooth animations
- Deployed on Vercel with custom domain

### Task Management App
**Technologies:** React, Node.js, PostgreSQL
- Developed full-stack application for team task management
- Implemented real-time updates using WebSockets
- Added user authentication and role-based permissions`;

export const useCVStore = create<CVState>()(
  persist(
    (set, get) => ({
      // Initial state
      markdown: DEFAULT_CV_CONTENT,
      layout: 'single-column',
      template: 'classic-professional',
      editorVisible: true,
      previewVisible: true,
      darkMode: false,
      isExporting: false,
      lastExported: null,

      // Actions
      setMarkdown: (markdown: string) => set({ markdown }),
      
      setLayout: (layout: 'single-column' | 'two-column') => set({ layout }),
      
      setTemplate: (template: string) => set({ template }),
      
      toggleEditor: () => set((state) => ({ 
        editorVisible: !state.editorVisible,
        // On mobile, if we're showing editor, hide preview
        previewVisible: window.innerWidth < 768 ? false : state.previewVisible
      })),
      
      togglePreview: () => set((state) => ({ 
        previewVisible: !state.previewVisible,
        // On mobile, if we're showing preview, hide editor
        editorVisible: window.innerWidth < 768 ? false : state.editorVisible
      })),
      
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      setExporting: (isExporting: boolean) => set({ 
        isExporting,
        lastExported: isExporting ? null : new Date()
      }),
    }),
    {
      name: 'cv-store',
      // Only persist core CV data, not UI state
      partialize: (state) => ({
        markdown: state.markdown,
        layout: state.layout,
        template: state.template,
        darkMode: state.darkMode,
      }),
    }
  )
);
