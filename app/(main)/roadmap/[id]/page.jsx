"use client";

import { useEffect, useState, use } from "react";
import { getRoadmapById } from "@/actions/roadmap";
import RoadmapVisualizer from "@/components/roadmap/RoadmapVisualizer";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { Loader2, BookOpen, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SavedRoadmapPage({ params }) {
  const { id } = use(params);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      const result = await getRoadmapById(id);
      if (result.success) setRoadmap(result.data);
      setLoading(false);
    };
    fetchRoadmap();
  }, [id]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-65px)] flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!roadmap) return <div className="p-10 text-center">Roadmap not found.</div>;

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col bg-white overflow-hidden">
      {/* Header with Back Button */}
      <div className="border-b px-6 py-4 flex items-center justify-between bg-white shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/roadmap/history">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{roadmap.jobTitle}</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
              Saved Career Architecture
            </p>
          </div>
        </div>
      </div>

      {/* Visualizer Area */}
      <div className="flex-1 relative bg-slate-50/50">
        <RoadmapVisualizer 
          initialNodes={roadmap.nodes} 
          initialEdges={roadmap.edges} 
          onNodeSelect={(data) => setSelectedNode(data)}
        />
      </div>

      {/* Professional Sidebar (Reused) */}
      <Sheet open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <SheetContent className="sm:max-w-md border-l border-slate-200">
          <SheetHeader className="space-y-4">
            <div className="p-2.5 bg-indigo-50 w-fit rounded-xl text-indigo-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <SheetTitle className="text-2xl font-bold text-slate-900 tracking-tight">
                {selectedNode?.title}
              </SheetTitle>
              <div className="h-1 w-12 bg-indigo-600 rounded-full" />
            </div>
            <SheetDescription className="text-base pt-2 text-slate-600 leading-relaxed">
              {selectedNode?.description}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-10 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-start text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white pr-3">
                Learning Resources
              </div>
            </div>

            {selectedNode?.link && (
              <a 
                href={selectedNode.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-600 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50">
                    <ExternalLink className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      Official Documentation
                    </p>
                    <p className="text-xs text-slate-500">Read technical guide</p>
                  </div>
                </div>
              </a>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}