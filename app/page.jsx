import HeroSection from "@/components/hero"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { faqs } from "@/data/faqs"
import { features } from "@/data/features"
import { howItWorks } from "@/data/howItWorks"
import { testimonial } from "@/data/testimonial"
import { ArrowRight, ChevronRight, Sparkles, Cpu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
/**/
export default function Home() {
  return (
      <div className="relative min-h-screen bg-white dark:bg-[#030712] text-slate-900 dark:text-slate-200 selection:bg-blue-100 dark:selection:bg-cyan-500/30 selection:text-blue-900 dark:selection:text-cyan-100 overflow-hidden font-sans transition-colors duration-500">

        {/* 🌌 DUAL BACKGROUND: Dot Grid (Light) & Tech Grid (Dark) 🌌 */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Light Mode Grid */}
          <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:hidden"></div>
          {/* Dark Mode Grid */}
          <div className="hidden dark:block absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

          {/* Ambient Glowing Orbs (Adapts to Light/Dark) */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-100 dark:bg-cyan-500/10 blur-[120px] dark:animate-pulse mix-blend-multiply dark:mix-blend-screen transition-all duration-700"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-100 dark:bg-purple-600/10 blur-[150px] mix-blend-multiply dark:mix-blend-screen transition-all duration-700"></div>
        </div>

        {/* 🛸 HERO SECTION */}
        <div className="relative z-10 pt-10 pb-20 animate-[fade-in_1s_ease-out]">
          <HeroSection />
        </div>

        {/* 🚀 PLATFORM TOOLKIT */}
        <section className="w-full py-24 relative z-10">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 text-xs font-black uppercase tracking-[0.1em] dark:tracking-[0.2em] mb-6 border border-blue-100 dark:border-cyan-500/30 shadow-sm dark:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all">
                <Sparkles className="w-4 h-4 dark:hidden" />
                <Cpu className="w-4 h-4 hidden dark:block" />
                <span className="dark:hidden">AI-Powered Intelligence</span>
                <span className="hidden dark:block">Quantum Toolkit</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-6 drop-shadow-sm dark:drop-shadow-md transition-colors">
                Powerful Features for Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 dark:animate-pulse">Growth</span>
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium transition-colors">
                Everything you need to outpace the competition, from AI-driven resume optimization to real-time interview simulations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {features.map((feature, index) => {
                const linkTarget = feature.title.includes("Resume") ? "/upload/uploadpage" :
                    feature.title.includes("Interview") ? "/mock-interview/dashboard" :
                        feature.title.includes("Insights") ? "/dashboard" : "/road-map";

                return (
                    <Link href={linkTarget} key={index} className="group outline-none h-full block">
                      <Card className="h-full bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] dark:shadow-none backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)] hover:border-blue-200 dark:hover:border-cyan-500/50 overflow-hidden relative rounded-[2rem] dark:rounded-3xl">

                        {/* Hover Top Edge (Adapts to theme) */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 dark:via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <CardContent className="p-8 flex flex-col h-full relative z-10">
                          {/* Icon Box */}
                          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border border-transparent dark:border-white/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 dark:group-hover:border-cyan-400/50 group-hover:text-white dark:group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-500">
                            {feature.icon}
                          </div>
                          <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 flex-grow font-medium transition-colors">
                            {feature.description}
                          </p>
                          <div className="flex items-center text-sm font-bold text-blue-600 dark:text-slate-500 dark:group-hover:text-cyan-400 transition-all duration-300 group-hover:translate-x-2">
                            Explore Tool <ChevronRight className="w-4 h-4 ml-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* 📊 METRICS BANNER */}
        <section className="w-full py-16 my-10 relative z-10 overflow-hidden border-y border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-black/40 backdrop-blur-lg transition-colors">
          <div className="hidden dark:block absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none"></div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto divide-x divide-slate-200 dark:divide-white/10">
              {[
                { stat: "50+", label: "Industries Covered" },
                { stat: "1000+", label: "Interview Scenarios" },
                { stat: "95%", label: "Success Rate" },
                { stat: "24/7", label: "AI Availability" },
              ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center justify-center space-y-2 text-center px-4 group">
                    <h3 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-white dark:to-slate-500 dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] dark:group-hover:drop-shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-500">{item.stat}</h3>
                    <p className="text-slate-400 dark:text-cyan-500/80 font-bold text-xs uppercase tracking-widest dark:tracking-[0.2em] transition-colors">{item.label}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* ⚙️ HOW IT WORKS */}
        <section className="w-full py-24 relative z-10">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 transition-colors">Simple Workflow</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium transition-colors">
                Four optimized phases to accelerate your career trajectory.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto relative">
              <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-[2px] bg-slate-200 dark:bg-slate-800 -z-10 transition-colors">
                <div className="hidden dark:block absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 blur-[2px]"></div>
              </div>

              {howItWorks.map((item, index) => {
                return (
                    <div key={index} className="flex flex-col items-center text-center group">
                      <div className="w-24 h-24 rounded-full bg-white dark:bg-[#0B1120] border-2 border-slate-100 dark:border-slate-800 shadow-md dark:shadow-[0_0_20px_rgba(0,0,0,0.8)] flex items-center justify-center mb-8 relative transition-all duration-500 hover:-translate-y-2 hover:border-blue-300 dark:hover:border-cyan-500 dark:hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                        <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-900 text-[10px] font-black flex items-center justify-center shadow-sm dark:shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-colors">
                          0{index + 1}
                        </span>
                        <div className="text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                          {item.icon}
                        </div>
                      </div>
                      <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white transition-colors">{item.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium transition-colors">{item.description}</p>
                    </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 💬 TESTIMONIALS */}
        <section className="w-full py-24 relative z-10 border-y border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] transition-colors">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 transition-colors">Success Stories</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {testimonial.map((testimonial, index) => {
                return (
                    <Card key={index} className="bg-white dark:bg-black/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-lg dark:shadow-2xl dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-2 transition-all duration-500 rounded-3xl dark:rounded-[2rem] overflow-hidden group">
                      <CardContent className="p-8">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-white/10 transition-colors">
                          <div className="relative">
                            <Image
                                width={56}
                                height={56}
                                src={testimonial.image}
                                alt={testimonial.author}
                                className="rounded-full object-cover border-2 border-slate-100 dark:border-slate-700 group-hover:border-blue-500 transition-colors"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-black rounded-full dark:shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-lg transition-colors">{testimonial.author}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold dark:font-black uppercase tracking-wider dark:tracking-[0.15em] mb-1 transition-colors">{testimonial.role}</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold transition-colors">{testimonial.company}</p>
                          </div>
                        </div>
                        <blockquote className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm font-medium relative transition-colors">
                          <span className="text-5xl text-slate-200 dark:text-slate-800 absolute -top-4 -left-3 font-serif pointer-events-none transition-colors">"</span>
                          <span className="relative z-10">{testimonial.quote}</span>
                        </blockquote>
                      </CardContent>
                    </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* ❓ FAQs */}
        <section className="w-full py-24 relative z-10">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 transition-colors">Common Questions</h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => {
                  return (
                      <AccordionItem key={index} value={`item-${index}`} className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl px-6 backdrop-blur-sm data-[state=open]:border-blue-300 dark:data-[state=open]:border-cyan-500/50 data-[state=open]:shadow-sm dark:data-[state=open]:bg-white/[0.06] dark:data-[state=open]:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300">
                        <AccordionTrigger className="text-left font-bold text-slate-800 dark:text-slate-200 hover:no-underline hover:text-blue-600 dark:hover:text-cyan-400 transition-colors py-6 text-lg">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed pb-6 text-base transition-colors">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                  )
                })}
              </Accordion>
            </div>
          </div>
        </section>

        {/* 🔥 MASSIVE CTA SECTION */}
        <section className="w-full py-24 mb-10 relative z-10">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="relative rounded-[3rem] overflow-hidden bg-[#0a0a0a] dark:bg-[#020617] p-12 md:p-24 text-center shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-slate-800 transition-colors duration-500">

              {/* Adapting Inner Glows */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] dark:hidden"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-blue-600/20 dark:from-cyan-500/20 to-transparent pointer-events-none blur-[50px]" />
              <div className="hidden dark:block absolute bottom-0 right-0 w-64 h-64 bg-purple-600/20 blur-[100px] pointer-events-none" />

              <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-white dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  Ready to Transform <br className="hidden md:block" /> Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 dark:from-cyan-400 dark:to-blue-500">Career?</span>
                </h2>
                <p className="text-slate-400 text-lg md:text-xl mb-12 leading-relaxed font-medium">
                  Join thousands of ambitious professionals using AI to outpace the competition and secure top-tier roles.
                </p>

                <Link href="/dashboard" passHref>
                  <Button
                      size="lg"
                      className="h-16 px-10 rounded-full bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 hover:bg-blue-700 dark:hover:bg-cyan-400 hover:scale-105 transition-all duration-300 text-lg font-bold dark:font-black shadow-lg shadow-blue-500/20 dark:shadow-[0_0_30px_rgba(6,182,212,0.4)] dark:hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] border-none"
                  >
                    Enter the Dashboard <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
  )
}