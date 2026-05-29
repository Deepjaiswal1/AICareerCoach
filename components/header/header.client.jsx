"use client"

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "../ui/button"
import {
  ChevronDown,
  Compass,
  FileText,
  GraduationCap,
  House,
  LayoutDashboard,
  MessageSquareCode,
  PenBox,
  SquareChartGantt,
  StarsIcon,
  Linkedin,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

// IMPORT THE NEW THEME TOGGLE
import { ThemeToggle } from "@/components/theme-toggle"

const HeaderClient = () => {
  return (
      <header className="fixed top-0 w-full border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#030712]/80 backdrop-blur-md z-50 transition-colors duration-500">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">

          {/* BRAND LOGO (Adapts to Light/Dark) */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 bg-slate-900 dark:bg-white/5 rounded-md group-hover:bg-blue-600 dark:group-hover:bg-cyan-500 border border-transparent dark:border-white/10 transition-all duration-500">
              <Compass className="text-white dark:text-cyan-400 group-hover:text-white h-5 w-5 stroke-[1.5] transition-colors" />
              <div className="absolute -inset-1 border border-slate-900/5 dark:border-cyan-500/20 rounded-md scale-110 group-hover:scale-125 transition-transform" />
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">
                Vantage<span className="text-blue-600 dark:text-cyan-400 font-light transition-colors">AI</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 mt-1 font-bold transition-colors">
                Executive Career Coaching
              </span>
            </div>
          </Link>

          {/* NAVIGATION BUTTONS */}
          <div className="flex items-center space-x-2 md:space-x-4">

            {/* 🌗 THE THEME TOGGLE BUTTON 🌗 */}
            <ThemeToggle />

            <SignedIn>
              <Link href="/">
                <Button variant="outline" className="border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <House className="h-4 w-4" />
                  <span className="hidden md:block">Home</span>
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden md:block">Industry Insights</span>
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-slate-900 hover:bg-blue-600 dark:bg-cyan-500/10 dark:text-cyan-400 dark:hover:bg-cyan-500 dark:hover:text-slate-900 dark:border dark:border-cyan-500/30 transition-all">
                    <StarsIcon className="h-4 w-4" />
                    <span className="hidden md:block">Growth Tools</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="dark:bg-[#0B1120] dark:border-slate-800">
                  <DropdownMenuItem asChild className="dark:hover:bg-slate-800 dark:focus:bg-slate-800 cursor-pointer">
                    <Link href="/resume" className="flex items-center gap-2 dark:text-slate-300">
                      <FileText className="h-4 w-4" />
                      <span>Build Resume</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="dark:hover:bg-slate-800 dark:focus:bg-slate-800 cursor-pointer">
                    <Link
                        href="/upload"
                        className="flex items-center gap-2 dark:text-slate-300"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Resume ATS Check</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="dark:hover:bg-slate-800 dark:focus:bg-slate-800 cursor-pointer">
                    <Link
                        href="/codequest"
                        className="flex items-center gap-2 dark:text-slate-300"
                    >
                      <MessageSquareCode className="h-4 w-4" />
                      <span>Code Quest</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="dark:hover:bg-slate-800 dark:focus:bg-slate-800 cursor-pointer">
                    <Link
                        href="/ai-cover-letter"
                        className="flex items-center gap-2 dark:text-slate-300"
                    >
                      <PenBox className="h-4 w-4" />
                      <span>Cover Letter</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="dark:hover:bg-slate-800 dark:focus:bg-slate-800 cursor-pointer">
                    <Link
                        href="/linkedin"
                        className="flex items-center gap-2 dark:text-slate-300"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span>LinkedIn Optimizer</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="dark:hover:bg-slate-800 dark:focus:bg-slate-800 cursor-pointer">
                    <Link href="/interview" className="flex items-center gap-2 dark:text-slate-300">
                      <GraduationCap className="h-4 w-4" />
                      <span>Aptitude Preparation</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="dark:hover:bg-slate-800 dark:focus:bg-slate-800 cursor-pointer">
                    <Link
                        href="/mock-interview/dashboard"
                        className="flex items-center gap-2 dark:text-slate-300"
                    >
                      <GraduationCap className="h-4 w-4" />
                      <span>Mock Interview Preparation</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="dark:hover:bg-slate-800 dark:focus:bg-slate-800 cursor-pointer">
                    <Link href="/road-map" className="flex items-center gap-2 dark:text-slate-300">
                      <SquareChartGantt className="h-4 w-4" />
                      <span>RoadMap</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SignedIn>

            <SignedOut>
              <SignInButton>
                <Button variant="outline" className="border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Sign In</Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </nav>
      </header>
  )
}

export default HeaderClient