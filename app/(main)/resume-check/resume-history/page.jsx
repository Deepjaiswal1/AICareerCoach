"use client";

import { useEffect, useState } from "react";
import { getResumeHistory } from "@/actions/resume";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  History, 
  Calendar, 
  Briefcase, 
  ChevronRight, 
  Loader2,
  FileSearch,
  ArrowUpRight,
  Search,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ResumeHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await getResumeHistory();
      if (res.success) setHistory(res.data);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieving Dossiers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Refined Header Area */}
      <div className="bg-slate-50/50 border-b border-slate-100 py-16 mb-12">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
                <Link href={`/resume-check`}>
                <Button variant={`link`}><ArrowLeft/>Back</Button>
                </Link>
              <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-indigo-600 rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
                  Analytics Engine
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Benchmark <span className="text-slate-400">Archive</span>
              </h1>
              <p className="text-slate-500 font-medium text-lg max-w-xl italic">
                A historical record of your resume performance and ATS compatibility indices.
              </p>
            </div>
            
            <div className="hidden lg:block bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Benchmarks</p>
              <p className="text-3xl font-black text-indigo-600">{history.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-5xl">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="h-20 w-20 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-6">
              <FileSearch className="h-10 w-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2 text-center">No Analysis Records</h2>
            <p className="text-slate-500 font-medium mb-8 text-center max-w-xs leading-relaxed">
              Your archive is empty. Start your first architectural benchmark to populate this space.
            </p>
            <Link href="/resume-check">
              <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all active:scale-95 flex items-center gap-2">
                Launch Architect
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {history.map((item) => (
              <Link key={item.id} href={`/resume-check?id=${item.id}`}>
                <div className="group relative bg-white border border-slate-200 rounded-[2rem] p-2 hover:border-indigo-500 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    
                    {/* Visual Score Ring */}
                    <div className="p-4">
                      <div className={`h-24 w-24 rounded-2xl flex flex-col items-center justify-center border-2 transition-colors duration-300 ${
                        item.matchPercentage >= 80 ? "bg-emerald-50 border-emerald-100 text-emerald-700" : 
                        item.matchPercentage >= 50 ? "bg-indigo-50 border-indigo-100 text-indigo-700" : 
                        "bg-slate-50 border-slate-100 text-slate-700"
                      }`}>
                        <span className="text-3xl font-black">{item.matchPercentage}%</span>
                        <span className="text-[9px] font-black uppercase tracking-tighter opacity-60">Match</span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-grow space-y-2 py-4">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-black text-[9px] uppercase tracking-widest px-2 py-0.5">
                          Report ID: {item.id.slice(-6)}
                        </Badge>
                        <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(item.createdAt), "dd MMM yyyy")}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.jobTitle || "Strategic Market Position"}
                      </h3>
                      
                      <p className="text-sm text-slate-400 font-medium line-clamp-1 max-w-xl">
                        {item.summary || "No executive summary provided for this analysis sequence."}
                      </p>
                    </div>

                    {/* Action Side */}
                    <div className="hidden md:flex pr-10 items-center justify-end">
                      <div className="h-12 w-12 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 group-hover:translate-x-2">
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}