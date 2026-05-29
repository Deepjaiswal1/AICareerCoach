"use client"

import { useState, useRef, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { analyzeResume, extractTextFromPDF, getAnalysisById } from "@/actions/resume"
import {
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Loader2,
  UploadCloud,
  FileType,
  Sparkles,
  Target,
  Zap,
  RefreshCw,
  PlusCircle,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function ResumeCheckPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const analysisId = searchParams.get("id")

  const [jobDesc, setJobDesc] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [isExtracting, setIsExtracting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const fileInputRef = useRef(null)

  // 1. Fetch saved analysis if ID is in URL
  useEffect(() => {
    const fetchSavedData = async () => {
      if (analysisId) {
        setLoading(true)
        try {
          const res = await getAnalysisById(analysisId)
          if (res.success) {
            setResult(res.data)
          } else {
            toast.error("Analysis record not found")
          }
        } catch (error) {
          toast.error("Error retrieving archived data")
        } finally {
          setLoading(false)
        }
      }
    }
    fetchSavedData()
  }, [analysisId])

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || file.type !== "application/pdf") {
      toast.error("Please upload a PDF file")
      return
    }

    setIsExtracting(true)
    const formData = new FormData()
    formData.append("file", file)

    const res = await extractTextFromPDF(formData)
    if (res.success) {
      setResumeText(res.text)
      toast.success("Resume text extracted!")
    } else {
      toast.error(res.error)
    }
    setIsExtracting(false)
  }

  const handleAnalyze = async () => {
    if (!resumeText || !jobDesc) {
      toast.error("Input required: Provide resume and job description.")
      return
    }

    setLoading(true)
    try {
      const res = await analyzeResume(resumeText, jobDesc)
      if (res.success) {
        setResult(res.data)
        window.scrollTo({ top: 0, behavior: "smooth" })
        toast.success("Analysis complete")
      } else {
        toast.error("Analysis failed")
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // 2. Reset Function to clear the view and the URL ID
  const handleNewAnalysis = () => {
    setResult(null)
    setJobDesc("")
    setResumeText("")
    router.push("/resume-check") // Clears the ?id= from the URL
  }

  return (
      <div className="min-h-screen bg-background text-foreground pb-20">

        {/* Header Section (Adjusted to sit below the global nav) */}
        <div className="bg-muted/30 border-b border-border pt-12 pb-12 mb-10">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1.5 w-10 bg-primary rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Executive Suite</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                  ATS <span className="text-primary">Architect</span>
                </h1>
              </div>

              <Link href="/resume-check/resume-history">
                <Button variant="outline" size="lg" className="rounded-2xl border-2 border-border bg-card hover:bg-muted font-bold text-card-foreground h-14 px-8">
                  <RefreshCw className="h-4 w-4 text-primary mr-2" />
                  View Archive
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left Column: Inputs */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Target className="h-4 w-4 text-primary" />
                  <h2>Target Job Requirements</h2>
                </div>
                <Textarea
                    placeholder="Paste the job description here..."
                    className="min-h-[250px] bg-card border-2 border-border rounded-2xl p-5 resize-none focus-visible:ring-primary text-foreground placeholder:text-muted-foreground"
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <FileType className="h-4 w-4 text-primary" />
                  <h2>Candidate Dossier</h2>
                </div>
                {!resumeText ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-border rounded-2xl p-10 bg-muted/20 hover:bg-muted/50 hover:border-primary cursor-pointer flex flex-col items-center group transition-all"
                    >
                      <input type="file" className="hidden" accept=".pdf" ref={fileInputRef} onChange={handleFileUpload} />
                      {isExtracting ? <Loader2 className="animate-spin h-10 w-10 text-primary" /> : <UploadCloud className="h-10 w-10 text-muted-foreground group-hover:text-primary mb-4 transition-colors" />}
                      <p className="text-sm font-bold text-foreground">Upload Resume PDF</p>
                    </div>
                ) : (
                    <div className="bg-emerald-500/10 border-2 border-emerald-500/20 rounded-2xl p-5 flex items-center justify-between">
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Resume Loaded</span>
                      <Button variant="ghost" size="sm" onClick={() => setResumeText("")} className="text-xs font-bold hover:bg-emerald-500/20">Change</Button>
                    </div>
                )}
              </div>

              <Button
                  className="w-full h-16 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 font-black text-xl shadow-xl transition-all"
                  onClick={handleAnalyze}
                  disabled={loading || isExtracting}
              >
                {loading ? <Loader2 className="animate-spin h-6 w-6 mr-2" /> : <Zap className="h-6 w-6 mr-2" />}
                Execute Benchmark
              </Button>
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-7">
              {loading ? (
                  <div className="h-full min-h-[500px] flex items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
              ) : result ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

                    {/* 3. New Benchmark Button */}
                    <div className="flex justify-end">
                      <Button onClick={handleNewAnalysis} variant="ghost" className="text-muted-foreground hover:text-primary font-black text-[10px] uppercase tracking-widest gap-2">
                        <PlusCircle className="h-4 w-4" /> Start Fresh Analysis
                      </Button>
                    </div>

                    {/* Score Header */}
                    <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-slate-900 dark:bg-black text-white">
                      <div className="p-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="relative h-40 w-40 flex items-center justify-center shrink-0">
                          <svg className="h-full w-full -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                            <circle
                                cx="80" cy="80" r="70"
                                stroke="currentColor" strokeWidth="12" fill="transparent"
                                strokeDasharray={440}
                                strokeDashoffset={440 - (440 * result.matchPercentage) / 100}
                                strokeLinecap="round"
                                className="text-primary"
                            />
                          </svg>
                          <span className="absolute text-5xl font-black">{result.matchPercentage}%</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-3">Compatibility Index</h3>
                          <p className="text-slate-400 leading-relaxed font-medium">{result.summary}</p>
                        </div>
                      </div>
                    </Card>

                    {/* Keyword & Formatting */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-none bg-muted/50 rounded-3xl p-6">
                        <h4 className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-4 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-destructive" /> Missing Keywords
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.missingKeywords?.length > 0 ? result.missingKeywords.map((kw, i) => (
                              <span key={i} className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-bold text-foreground">{kw}</span>
                          )) : <span className="text-xs text-muted-foreground italic">No missing critical keywords detected.</span>}
                        </div>
                      </Card>

                      {/* 4. Professional Formatting Check with Fallback */}
                      <Card className="border-none bg-primary/10 rounded-3xl p-6">
                        <h4 className="text-xs font-black uppercase text-primary tracking-widest mb-4 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" /> Formatting Check
                        </h4>
                        <ul className="space-y-3">
                          {result.formattingIssues && result.formattingIssues.length > 0 ? (
                              result.formattingIssues.map((issue, i) => (
                                  <li key={i} className="text-xs font-bold text-foreground flex items-start gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                    {issue}
                                  </li>
                              ))
                          ) : (
                              <li className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                <Sparkles className="h-4 w-4" />
                                Document structure meets professional standards.
                              </li>
                          )}
                        </ul>
                      </Card>
                    </div>

                    {/* Strategy Roadmap */}
                    <Card className="border-none bg-primary rounded-[2rem] p-8 text-primary-foreground shadow-xl">
                      <div className="flex items-center gap-3 mb-8">
                        <Lightbulb className="h-6 w-6 text-yellow-300" />
                        <h3 className="text-xl font-black">Optimization Roadmap</h3>
                      </div>
                      <div className="space-y-4">
                        {result.suggestions?.map((sug, i) => (
                            <div key={i} className="flex gap-5 p-5 bg-black/10 rounded-2xl border border-white/10 items-start">
                              <span className="text-2xl font-black opacity-30">0{i + 1}</span>
                              <p className="text-sm font-bold leading-relaxed">{sug}</p>
                            </div>
                        ))}
                      </div>
                    </Card>
                  </div>
              ) : (
                  <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-border rounded-[3rem] bg-muted/10 p-12 text-center">
                    <Sparkles className="h-10 w-10 text-primary mb-8" />
                    <h2 className="text-3xl font-black text-foreground mb-4">Benchmark Pending</h2>
                    <p className="text-muted-foreground font-bold max-w-sm mb-10 leading-relaxed">
                      Upload your dossier and define target requirements to initiate analysis.
                    </p>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}