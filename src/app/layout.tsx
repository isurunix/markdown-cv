import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Markdown CV Builder",
  description: "Create beautiful, ATS-friendly CVs and resumes using markdown with real-time preview and PDF export",
  keywords: ["CV", "resume", "markdown", "ATS", "PDF", "builder", "professional"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Note: Browser extensions (Grammarly, LastPass, etc.) may add attributes 
          to the body element, causing hydration warnings. These are safe to ignore 
          as they don't affect application functionality. */}
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
