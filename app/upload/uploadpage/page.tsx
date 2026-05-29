"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUploader from "@/components/FileUploader";
import Navbar from "@/components/Navbar";
import { convertPdfToImage } from "../../lib/pdf2img";

export default function UploadPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [jobTitle, setJobTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleAnalyze = async () => {
        setErrorMsg("");
        if (!file || jobTitle.length < 2) return setErrorMsg("Upload a resume and enter a valid Job Title.");

        setLoading(true);
        setStatus("Generating preview image...");

        try {
            const imageResult = await convertPdfToImage(file);
            const imageFile = imageResult.file;

            if (!imageFile) {
                console.warn("Image generation failed, continuing with PDF only...");
            }

            setStatus("Uploading files...");
            const formData = new FormData();
            formData.append("files", file);
            if (imageFile) {
                formData.append("files", imageFile);
            }

            const uploadRes = await fetch("/api/files/upload", { method: "POST", body: formData });
            if (!uploadRes.ok) throw new Error("Upload failed.");

            const filesData = await uploadRes.json();

            const pdfUrl = filesData.find((f: any) => f.url.endsWith(".pdf"))?.url || filesData[0]?.url;
            const imageUrl = filesData.find((f: any) => f.url.endsWith(".png"))?.url || "";

            setStatus("Analyzing resume with AI...");
            const aiRes = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: `Target Role: ${jobTitle}. strict JSON return.`,
                    fileUrl: pdfUrl
                })
            });

            if (!aiRes.ok) throw new Error("AI Analysis Failed.");
            const aiData = await aiRes.json();

            // BULLETPROOF JSON EXTRACTION
            const rawContent = aiData.message?.content || aiData.content || aiData.text || "";
            let feedback;

            try {
                let cleanContent = rawContent.replace(/```json/gi, "").replace(/```/g, "").trim();
                const firstBrace = cleanContent.indexOf('{');
                const lastBrace = cleanContent.lastIndexOf('}');

                if (firstBrace !== -1 && lastBrace !== -1) {
                    const jsonString = cleanContent.substring(firstBrace, lastBrace + 1);
                    feedback = JSON.parse(jsonString);
                } else {
                    feedback = JSON.parse(cleanContent);
                }
            } catch (parseError) {
                console.error("AI Data Parse Error:", rawContent);
                throw new Error("The AI returned invalid format. Please try again.");
            }

            setStatus("Saving Analysis...");
            const newId = Date.now().toString();
            await fetch("/api/kv/set", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: `resume:${newId}`,
                    value: {
                        id: newId,
                        jobTitle,
                        overallScore: feedback.overallScore || 0,
                        resumePath: pdfUrl,
                        previewUrl: imageUrl,
                        feedback,
                        createdAt: new Date()
                    }
                })
            });

            router.push(`/resume/${newId}`);
        } catch (error: any) {
            console.error(error);
            setErrorMsg(error.message || "Analysis Error");
        } finally {
            setLoading(false);
            setStatus("");
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <Navbar />
            <div className="max-w-2xl mx-auto pt-24 px-6">
                <div className="bg-card rounded-3xl p-8 shadow-xl border border-border animate-in fade-in slide-in-from-bottom-4">
                    <h1 className="text-3xl font-black mb-6">New Analysis</h1>

                    {errorMsg && <div className="p-3 mb-4 bg-destructive/10 text-destructive rounded-lg text-sm font-bold">{errorMsg}</div>}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold mb-2">Target Job Title</label>
                            <input
                                type="text"
                                className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary outline-none text-foreground placeholder:text-muted-foreground"
                                placeholder="e.g. Frontend Developer"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">Upload Resume (PDF)</label>
                            <div className="border-2 border-dashed border-border rounded-xl p-4 bg-muted/20 hover:bg-muted/50 transition-colors">
                                <FileUploader onFileSelect={setFile} />
                            </div>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {status}
                                </>
                            ) : "Start Analysis"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}