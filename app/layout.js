import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import Header from "@/components/header/header.server"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"
import Link from "next/link"
import { Compass, Github, Twitter, Linkedin } from "lucide-react"

export const runtime = "nodejs"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "VantageAI - AI Career Coach",
  description: "Advanced AI tools to master your job applications.",
}

export default function RootLayout({ children }) {
  return (
      <ClerkProvider>
        {/* Add suppressHydrationWarning to html to prevent next-themes hydration mismatch errors */}
        <html lang="en" suppressHydrationWarning>
        <body
            suppressHydrationWarning
            // Crucial fix: Let Tailwind handle the bg colors dynamically. Removed 'bg-white'
            className={`${inter.className} bg-background text-foreground antialiased selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-cyan-500/30 dark:selection:text-cyan-100 transition-colors duration-500`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            disableTransitionOnChange
        >
          <Header />

          {/* The pt-16 accounts for the 4rem (16) header height */}
          <main className="min-h-screen pt-16 flex flex-col relative z-0">
            <div className="flex-1">{children}</div>
          </main>

          <Toaster richColors position="top-center" />

          {/* Footer with proper dark mode classes */}
          <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] pt-16 pb-8 mt-20 relative z-10 transition-colors duration-500">
            <div className="container mx-auto px-6 max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                <div className="col-span-1 md:col-span-2">
                  <Link href="/" className="flex items-center gap-3 mb-6 group">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-600 dark:bg-cyan-500/10 rounded-lg shadow-sm shadow-blue-500/20 border border-transparent dark:border-cyan-500/30 group-hover:scale-105 transition-all">
                      <Compass className="text-white dark:text-cyan-400 h-5 w-5 stroke-[1.5]" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">
                          Vantage<span className="text-blue-600 dark:text-cyan-400 font-light">AI</span>
                        </span>
                    </div>
                  </Link>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed mb-6 font-medium transition-colors">
                    Elevating professional trajectories with AI-driven insights, resume optimization, and executive interview preparation.
                  </p>
                  <div className="flex items-center gap-4">
                    <Link href="#" className="text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"><Twitter size={20} /></Link>
                    <Link href="#" className="text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"><Github size={20} /></Link>
                    <Link href="#" className="text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"><Linkedin size={20} /></Link>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-6 transition-colors">Platform</h4>
                  <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    <li><Link href="/resume" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Resume Builder</Link></li>
                    <li><Link href="/upload" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">ATS Architect</Link></li>
                    <li><Link href="/codequest" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">CodeQuest</Link></li>
                    <li><Link href="/linkedin" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">LinkedIn Optimizer</Link></li>
                    <li><Link href="/ai-cover-letter" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Cover Letter</Link></li>
                    <li><Link href="/interview" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Aptitude Test</Link></li>
                    <li><Link href="/mock-interview/dashboard" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Mock Interview</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-6 transition-colors">Company</h4>
                  <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    <li><Link href="#" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">About Us</Link></li>
                    <li><Link href="#" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
                    <li><Link href="#" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
                    <li><Link href="#" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Contact Support</Link></li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  © {new Date().getFullYear()} VantageAI Inc. All rights reserved.
                </p>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  Made by <span className="text-slate-800 dark:text-slate-300">DJ & Abhi</span>
                </p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
        </body>
        </html>
      </ClerkProvider>
  )
}