"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Summary from "@/components/Summary";
import ATS from "@/components/ATS";
import Details from "@/components/Details";
import LinkedInOptimizer from "@/components/LinkedInOptimizer";
import Navbar from "@/components/Navbar";

export default function ResumePage() {
    const params = useParams();
    const id = params?.id as string;

    const [feedback, setFeedback] = useState<any | null>(null);
    const [rawText, setRawText] = useState("");
    const [loading, setLoading] = useState(true);
    const [resumeUrl, setResumeUrl] = useState("");

    useEffect(() => {
        if (!id) return;

        // Fetch data from your KV store
        fetch(`/api/kv/get/resume:${id}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) {
                    if (data.previewUrl) setResumeUrl(data.previewUrl);
                    else if (data.imagePath) setResumeUrl(data.imagePath);
                    else if (data.resumePath) setResumeUrl(data.resumePath);

                    const parsedFeedback = typeof data.feedback === 'string'
                        ? JSON.parse(data.feedback)
                        : data.feedback;

                    setFeedback(parsedFeedback);
                    setRawText(JSON.stringify(parsedFeedback));
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <div className="flex flex-col md:flex-row flex-1 mt-16">

                {/* Left Side: PDF/Image Viewer */}
                <div className="w-full md:w-1/2 bg-muted/30 h-[50vh] md:h-[calc(100vh-4rem)] md:sticky md:top-16 border-r border-border relative">
                    <div className="absolute top-4 left-4 z-10">
                        {/* Changed the Back link to point to your new Dashboard location */}
                        <Link href="/upload" className="bg-background/90 px-3 py-1.5 rounded-md text-sm font-bold text-foreground shadow-sm hover:bg-muted border border-border backdrop-blur-sm transition-colors">
                            ← Back to Dashboard
                        </Link>
                    </div>
                    {resumeUrl ? (
                        resumeUrl.endsWith(".pdf") ? (
                            <iframe src={resumeUrl} className="w-full h-full" title="Resume PDF" />
                        ) : (
                            <img src={resumeUrl} alt="Resume Preview" className="w-full h-full object-contain bg-black/5" />
                        )
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground font-medium">
                            {loading ? "Loading Preview..." : "No preview available"}
                        </div>
                    )}
                </div>

                {/* Right Side: Analysis Results */}
                <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto">
                    <h1 className="text-3xl font-black text-foreground mb-6">Neural Review</h1>

                    {loading ? (
                        <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-4">
                            <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                            <span className="font-medium tracking-wide">Analyzing data...</span>
                        </div>
                    ) : feedback ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS?.score || 0} suggestions={feedback.ATS?.tips || []} />
                            <Details feedback={feedback} />

                            <div className="pt-8 mt-8 border-t border-border">
                                <LinkedInOptimizer resumeText={rawText} />
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-center font-bold">
                            Analysis unavailable. Please retry the upload.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}