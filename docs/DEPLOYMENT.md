# Deployment Guide

## 🚀 Deployment Strategy

### Overview
This guide covers deploying the Markdown CV Builder to production using modern, scalable infrastructure. We recommend Vercel for its excellent Next.js integration, but also provide alternatives.

### Deployment Platforms

#### Primary: Vercel (Recommended)
**Why Vercel:**
- ✅ Built specifically for Next.js applications
- ✅ Zero-config deployments with GitHub integration
- ✅ Global CDN and edge computing
- ✅ Automatic HTTPS and custom domains
- ✅ Built-in analytics and performance monitoring
- ✅ Generous free tier suitable for MVP

**Limitations:**
- PDF generation via Puppeteer requires Vercel Pro plan
- Function execution time limits (10s hobby, 60s pro)

#### Alternative: Netlify
**Pros:** Great for static sites, good free tier, easy setup
**Cons:** Limited serverless function capabilities for PDF generation

#### Alternative: Railway/Render
**Pros:** Full Docker support, better for complex server requirements
**Cons:** More complex setup, higher costs

## 📋 Pre-Deployment Checklist

### Code Preparation
- [ ] All features tested locally
- [ ] TypeScript compilation passes (`npm run build`)
- [ ] ESLint and Prettier checks pass
- [ ] Environment variables configured
- [ ] Performance optimization completed
- [ ] SEO meta tags added

### Security Review
- [ ] No sensitive data in client-side code
- [ ] API routes secured and rate-limited
- [ ] Image URL validation implemented
- [ ] XSS protection verified
- [ ] CSRF protection configured

### Performance Optimization
- [ ] Bundle size analysis completed
- [ ] Images optimized (using Next.js Image component)
- [ ] Code splitting implemented
- [ ] Fonts preloaded
- [ ] Critical CSS inlined

## 🔧 Vercel Deployment Setup

### 1. Repository Configuration

#### Project Structure Verification
```bash
markdown-cv/
├── package.json
├── next.config.js
├── vercel.json (optional)
├── src/
├── public/
└── .env.example
```

#### Environment Variables Setup
Create `.env.local` for local development:
```bash
# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Markdown CV Builder"

# PDF Generation (if using Puppeteer)
PUPPETEER_EXECUTABLE_PATH=""

# Analytics (optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS=""
NEXT_PUBLIC_VERCEL_ANALYTICS=""
```

### 2. Vercel Configuration

#### `vercel.json` Configuration
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "src/app/api/pdf/route.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_APP_URL": "@app-url",
    "NEXT_PUBLIC_APP_NAME": "@app-name"
  }
}
```

#### Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "build:analyze": "ANALYZE=true npm run build"
  }
}
```

### 3. Deployment Steps

#### Automatic Deployment (Recommended)
1. **Connect Repository**: Link GitHub/GitLab repository to Vercel
2. **Configure Build Settings**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Environment Variables**: Add production environment variables in Vercel dashboard

4. **Domain Configuration**: Set up custom domain (optional)

#### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## 🐳 Docker Deployment (Alternative)

### Dockerfile
```dockerfile
# Base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose (Development)
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
    restart: unless-stopped
```

## 🔍 Monitoring & Analytics

### Performance Monitoring

#### Vercel Analytics Integration
```tsx
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### Web Vitals Monitoring
```tsx
// src/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Error Monitoring

#### Sentry Integration (Optional)
```bash
npm install @sentry/nextjs
```

```javascript
// next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  // Your existing Next.js config
};

module.exports = withSentryConfig(nextConfig, {
  org: "your-org",
  project: "markdown-cv",
  silent: true,
});
```

## 🛡️ Security Configuration

### Content Security Policy
```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};
```

### Rate Limiting
```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

// Usage in API routes
export async function POST(request: Request) {
  const { success } = await ratelimit.limit('pdf-generation');
  
  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 });
  }
  
  // Continue with PDF generation
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📊 Post-Deployment Validation

### Automated Testing
```bash
# Health check script
curl -f https://your-domain.com/api/health || exit 1

# PDF generation test
curl -X POST https://your-domain.com/api/pdf \
  -H "Content-Type: application/json" \
  -d '{"content":"# Test CV","layout":"single-column"}' \
  --output test.pdf
```

### Performance Testing
```javascript
// tests/performance.test.js
import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';

test('Performance metrics', async () => {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {logLevel: 'info', output: 'json', port: chrome.port};
  
  const runnerResult = await lighthouse('https://your-domain.com', options);
  
  expect(runnerResult.lhr.categories.performance.score).toBeGreaterThan(0.9);
  expect(runnerResult.lhr.categories.accessibility.score).toBeGreaterThan(0.95);
  
  await chrome.kill();
});
```

## 🚨 Troubleshooting

### Common Deployment Issues

#### PDF Generation Failures
**Problem**: Puppeteer fails in serverless environment
**Solution**: 
```typescript
// Use chrome-aws-lambda for Vercel
import chromium from 'chrome-aws-lambda';

const browser = await chromium.puppeteer.launch({
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath,
  headless: chromium.headless,
});
```

#### Build Size Issues
**Problem**: Bundle size exceeds limits
**Solution**:
```javascript
// next.config.js
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@monaco-editor/react'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-pdf': false, // Exclude if not needed
    };
    return config;
  },
};
```

#### Memory Issues
**Problem**: Function exceeds memory limits
**Solution**: Optimize PDF generation and increase function memory in Vercel settings

### Monitoring Checklist
- [ ] Application loads successfully
- [ ] PDF generation works
- [ ] Images load from external URLs
- [ ] Mobile responsiveness verified
- [ ] Performance metrics meet targets
- [ ] Error tracking operational
- [ ] Analytics collecting data

## 📈 Scaling Considerations

### Horizontal Scaling
- **Edge Functions**: Use Vercel Edge Runtime for better performance
- **Database**: Add database for user accounts and CV storage
- **CDN**: Implement image CDN for user uploads
- **Caching**: Add Redis for session management

### Vertical Scaling
- **Function Memory**: Increase memory allocation for PDF generation
- **Execution Time**: Monitor and optimize function execution times
- **Concurrent Users**: Test with load testing tools

This deployment guide ensures a smooth, secure, and scalable production deployment of the Markdown CV Builder.
