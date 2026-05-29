"use client"

import Link from "next/link"
import React, { useEffect, useRef } from "react"
import { Button } from "./ui/button"
import Image from "next/image"
import { ArrowRight, Sparkles, Cpu } from "lucide-react"

const HeroSection = () => {
  const imageRef = useRef(null)

  useEffect(() => {
    const imageElement = imageRef.current

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const scrollThreshold = 100

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled")
      } else {
        imageElement.classList.remove("scrolled")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
      <section className="w-full pt-44 md:pt-60 pb-20 relative z-10">

        {/* 🌌 Ambient Glowing Orbs specifically for the Hero (Adapts to Light/Dark) 🌌 */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Light Mode Glows (Blue/Purple) */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-100 opacity-60 blur-[120px] mix-blend-multiply dark:hidden transition-all duration-700"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-100 opacity-60 blur-[150px] mix-blend-multiply dark:hidden transition-all duration-700"></div>

          {/* Dark Mode Glows (Cyan/Purple Neon) */}
          <div className="hidden dark:block absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse transition-all duration-700"></div>
          <div className="hidden dark:block absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[150px] transition-all duration-700"></div>
        </div>

        <div className="container mx-auto px-6 space-y-12 text-center relative z-10 animate-[fade-in_1s_ease-out]">
          <div className="space-y-6 mx-auto max-w-5xl">

            {/* Futuristic Featured Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 text-xs font-black uppercase tracking-widest mb-6 border border-blue-100 dark:border-cyan-500/30 shadow-[0_0_20px_rgba(37,99,235,0.1)] dark:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all">
              <Sparkles className="w-4 h-4" /> Your Professional Evolution Start Now
            </div>

            <h1 className="text-5xl font-black md:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-slate-900 dark:text-white drop-shadow-sm transition-colors">
              Your AI Career Coach for
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">Professional Success</span>
            </h1>

            <p className="mx-auto max-w-3xl font-medium text-lg md:text-xl text-slate-600 dark:text-slate-400 transition-colors">
              Advance your career with personalized guidance, interview
              preparation, and AI-powered tools for job success.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-10 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 hover:scale-105 transition-all text-base font-bold shadow-lg shadow-slate-900/10 dark:shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/resume">
              <Button size="lg" variant="ghost" className="h-14 px-10 rounded-full text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors text-base font-semibold">
                Analyze Resume
              </Button>
            </Link>
          </div>

          {/* Hero Video Mockup Area */}
          <div className="hero-image-wrapper mt-16 md:mt-24 max-w-[1000px] mx-auto px-6">
            <div ref={imageRef} className="hero-image rounded-[1.5rem] border-2 border-slate-100 dark:border-cyan-500/30 bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_0_60px_-10px_rgba(6,182,212,0.3)] transition-all overflow-hidden relative group">

              {/* Sleek Top Neon Edge in Dark Mode */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>

              {/* The glass panel mockup holding the video */}
              <div className="w-full flex flex-col relative aspect-video max-h-[600px]">

                {/* Mockup Header Bar */}
                <div className="bg-slate-50/80 dark:bg-[#0B1120]/90 border-b border-slate-200 dark:border-white/10 flex items-center gap-2.5 px-4 sm:px-6 h-10 sm:h-12 relative z-10 shrink-0 backdrop-blur-md">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/90 shadow-sm"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400/90 shadow-sm"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/90 shadow-sm"></div>
                  </div>
                  <div className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-xs font-mono font-medium flex-grow text-center tracking-wider">vantageai_console</div>
                </div>

                {/* 🔴 PLATFORM VIDEO PREVIEW 🔴 */}
                <div className="relative w-full flex-grow bg-[#050505] overflow-hidden">
                  <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover object-center sm:object-contain transition-opacity"
                  >
                    <source src="/videos/Animations.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Subtle inner shadow overlay to blend the video into the frame */}
                  <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] pointer-events-none"></div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default HeroSection