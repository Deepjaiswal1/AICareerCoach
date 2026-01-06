"use client"

import Link from "next/link"
import React, { useEffect, useRef } from "react"
import { Button } from "./ui/button"
import Image from "next/image"

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
    <section className="w-full pt-36 md:pt-48 pb-10">
      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
          <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient">
            Your AI Career Coach for
            <br />
            Professional Success
          </h1>
          <p className="mx-auto max-w-150 font-bold md:text-xl gradient">
            Advance your career with personalized guidance, interview
            preparation, and AI-powered tools for job success.
          </p>
        </div>
        <div>
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image">
            {/* <Image
              src={"/banner1.png"}
              width={1280}
              height={720}
              alt="Banner"
              className="rounded-lg shadow-2xl mx-auto"
              priority
            /> */}
            {/* <script
              type="module"
              src="https://unpkg.com/@splinetool/viewer@1.12.22/build/spline-viewer.js"
            ></script>
            <spline-viewer url="https://prod.spline.design/skAz60271OGPfuGl/scene.splinecode"></spline-viewer> */}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
