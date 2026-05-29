// "use client";

// import { useState, useEffect } from "react";
// import { createAIRoadmap } from "@/actions/roadmap";
// import RoadmapVisualizer from "@/components/roadmap/RoadmapVisualizer";
// import { Button } from "@/components/ui/button";
// import { ExternalLink, Briefcase } from "lucide-react"
// import { fetchLiveJobs } from "@/app/actions/getJobs"
// import { Input } from "@/components/ui/input";
// import { 
//   Sheet, 
//   SheetContent, 
//   SheetHeader, 
//   SheetTitle, 
//   SheetDescription 
// } from "@/components/ui/sheet";
// import { 
//   Loader2, 
//   Sparkles, 
//   Search, 
//   BookOpen, 
//   ExternalLink,
//   History, // Added icon
//   Compass
// } from "lucide-react";
// import { toast } from "sonner";
// import Link from "next/link"; // Added Link for navigation

// export default function JobSidebar({ targetRole }) {
//   const [jobs, setJobs] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function load() {
//       const data = await fetchLiveJobs(targetRole)
//       setJobs(data.slice(0, 4)) // Only show top 4
//       setLoading(false)
//     }
//     load()
//   }, [targetRole])

// export default function RoadmapPage() {
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [roadmapData, setRoadmapData] = useState(null);
//   const [selectedNode, setSelectedNode] = useState(null);

//   const handleGenerate = async () => {
//     if (!query.trim()) return;
//     setLoading(true);
//     try {
//       const result = await createAIRoadmap(query);
//       if (result.success) {
//         setRoadmapData(result.data);
//         toast.success("Roadmap generated and saved to history!");
//       } else {
//         toast.error(result.error || "Failed to generate roadmap");
//       }
//     } catch (error) {
//       toast.error("An unexpected error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (

    
//     <div className="h-[calc(100vh-65px)] flex flex-col bg-white overflow-hidden">
//       {/* Search Header - High Contrast Navigation */}
//       <div className="border-b px-6 py-4 flex items-center justify-between bg-white shrink-0 z-10 shadow-sm">
        
//         <div className="flex flex-col leading-none">
//         <span className="text-2xl font-bold tracking-tight text-slate-900">
//           Vantage<span className="text-indigo-600 font-light">AI</span>
//         </span>
//         <span className="text-[9px] uppercase tracking-[0.4em] text-slate-400 mt-1 font-semibold">
//           Executive Career Coaching
//         </span>
//       </div>

//         <div className="flex items-center gap-3">
          

//           <div className="relative w-48 md:w-64">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//             <Input 
//               placeholder="e.g. Frontend Engineer" 
//               className="pl-10 h-10 rounded-xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
//             />
//           </div>
//           <Button 
//             onClick={handleGenerate} 
//             disabled={loading} 
//             className="h-10 rounded-xl px-6 bg-black text-white hover:bg-slate-800 transition-colors"
//           >
//             {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
//           </Button>
//         </div>
//         {/* History Button - Ghost style to maintain hierarchy */}
//           <Link href="/roadmap/history">
//             <Button variant="outline" className="h-10 rounded-xl px-4 border-slate-200 hover:bg-slate-50 gap-2 text-slate-600">
//               <History className="h-4 w-4" />
//               <span className="hidden md:inline">History</span>
//             </Button>
//           </Link>
//       </div>

//       {/* Visualizer Area */}
//       <div className="flex-1 relative bg-slate-50/50">
//         {roadmapData ? (
//           <RoadmapVisualizer 
//             initialNodes={roadmapData.nodes} 
//             initialEdges={roadmapData.edges} 
//             onNodeSelect={(data) => setSelectedNode(data)}
//           />
//         ) : (
//           <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
//             <div className="p-6 bg-white rounded-3xl shadow-xl border border-slate-100">
//                <Sparkles className="h-12 w-12 text-indigo-100" />
//             </div>
//             <div className="text-center">
//               <p className="text-sm font-semibold text-slate-600">Architect Ready</p>
//               <p className="text-xs text-slate-400">Specify a role to visualize your technical journey</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Professional Detailed Report Sidebar */}
//       <Sheet open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
//         <SheetContent className="sm:max-w-md border-l border-slate-200 bg-white">
//           <SheetHeader className="space-y-4">
//             <div className="p-2.5 bg-indigo-50 w-fit rounded-xl text-indigo-600">
//               <BookOpen className="h-5 w-5" />
//             </div>
//             <div className="space-y-1">
//               <SheetTitle className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
//                 {selectedNode?.title}
//               </SheetTitle>
//               <div className="h-1 w-12 bg-indigo-600 rounded-full" />
//             </div>
//             <SheetDescription className="text-base pt-2 leading-relaxed text-slate-600">
//               {selectedNode?.description}
//             </SheetDescription>
//           </SheetHeader>

//           <div className="mt-10 space-y-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center" aria-hidden="true">
//                 <div className="w-full border-t border-slate-100" />
//               </div>
//               <div className="relative flex justify-start text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white pr-3">
//                 Learning Resources
//               </div>
//             </div>

//             {selectedNode?.link ? (
//               <a 
//                 href={selectedNode.link} 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="group flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-600 hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-300"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
//                     <ExternalLink className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
//                   </div>
//                   <div>
//                     <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
//                       Official Documentation
//                     </p>
//                     <p className="text-xs text-slate-500">Master core concepts and best practices</p>
//                   </div>
//                 </div>
//               </a>
//             ) : (
//               <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200">
//                 <p className="text-sm text-slate-400 italic">No additional documentation available.</p>
//               </div>
//             )}

//             <div className="mt-12 p-5 bg-slate-50 rounded-2xl border border-slate-100">
//               <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mb-1">
//                 Architect Note
//               </p>
//               <p className="text-xs text-slate-500 leading-normal italic">
//                 Focus on fundamental understanding before proceeding to the next node. Technical depth in this area is a prerequisite for advanced career modules.
//               </p>
//             </div>
//           </div>
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { createAIRoadmap } from "@/actions/roadmap";
import RoadmapVisualizer from "@/components/roadmap/RoadmapVisualizer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { fetchLiveJobs } from "@/app/actions/getJobs"; 
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { 
  Loader2, 
  Sparkles, 
  Search, 
  BookOpen, 
  ExternalLink,
  History, 
  Briefcase,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { fetchLiveJobs } from "@/actions/getJobs";

// Find the JobSidebar component inside your roadmap/page.jsx and replace it:

function JobSidebar({ targetRole }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!targetRole) return;
      setJobs([]); // Clear old jobs
      setLoading(true);
      try {
        const data = await fetchLiveJobs(targetRole);
        setJobs(data);
      } catch (err) {
        console.error("Job fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [targetRole]);

  if (!targetRole) return null;

  return (
    <div className="w-80 border-l bg-white flex flex-col shrink-0 hidden lg:flex">
      <div className="p-6 border-b bg-slate-50/50">
        <div className="flex items-center gap-2 mb-1">
          <Briefcase className="h-4 w-4 text-indigo-600" />
          <h3 className="font-bold text-sm text-slate-900">Live Opportunities</h3>
        </div>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
          Source: LinkedIn via Apify
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600 mb-2" />
              <p className="text-[11px] text-slate-500 animate-pulse">
                Scraping live listings... <br /> This may take a few seconds.
              </p>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 w-full bg-slate-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          jobs.map((job, idx) => (
            <a
              key={idx}
              href={job.job_apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-sm transition-all group bg-white"
            >
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600">
                {job.job_title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">{job.employer_name}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">
                  {job.job_is_remote ? "Remote" : job.job_city}
                </span>
                <ExternalLink className="h-3 w-3 text-slate-300 group-hover:text-indigo-400" />
              </div>
            </a>
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-xs text-slate-400">No live jobs found for this role.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function RoadmapPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeRole, setActiveRole] = useState("");

  const handleGenerate = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const result = await createAIRoadmap(query);
      if (result.success) {
        setRoadmapData(result.data);
        setActiveRole(query); // Set this to trigger the Job Search
        toast.success("Roadmap generated successfully!");
      } else {
        toast.error(result.error || "Failed to generate roadmap");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col bg-white overflow-hidden">
      {/* Search Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between bg-white shrink-0 z-10 shadow-sm">
        <div className="flex flex-col leading-none">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Vantage<span className="text-indigo-600 font-light">AI</span>
          </span>
          <span className="text-[9px] uppercase tracking-[0.4em] text-slate-400 mt-1 font-semibold">
            Executive Career Coaching
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-48 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="e.g. Frontend Engineer"
              className="pl-10 h-10 rounded-xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="h-10 rounded-xl px-6 bg-black text-white hover:bg-slate-800 transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
          </Button>
          
          <Link href="/roadmap/history">
            <Button variant="outline" className="h-10 rounded-xl px-4 border-slate-200 hover:bg-slate-50 gap-2 text-slate-600">
              <History className="h-4 w-4" />
              <span className="hidden md:inline">History</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Area: Visualizer + Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Visualizer Area */}
        <div className="flex-1 relative bg-slate-50/50">
          {roadmapData ? (
            <RoadmapVisualizer
              initialNodes={roadmapData.nodes}
              initialEdges={roadmapData.edges}
              onNodeSelect={(data) => setSelectedNode(data)}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
              <div className="p-6 bg-white rounded-3xl shadow-xl border border-slate-100">
                <Sparkles className="h-12 w-12 text-indigo-100" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-600">Architect Ready</p>
                <p className="text-xs text-slate-400">Specify a role to visualize your technical journey</p>
              </div>
            </div>
          )}
        </div>

        {/* JOB SIDEBAR - Only shows when a roadmap exists */}
        {roadmapData && <JobSidebar targetRole={activeRole} />}
      </div>

      {/* Professional Detailed Report Sidebar (Sheet) */}
      <Sheet open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <SheetContent className="sm:max-w-md border-l border-slate-200 bg-white">
          <SheetHeader className="space-y-4">
            <div className="p-2.5 bg-indigo-50 w-fit rounded-xl text-indigo-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <SheetTitle className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                {selectedNode?.title}
              </SheetTitle>
              <div className="h-1 w-12 bg-indigo-600 rounded-full" />
            </div>
            <SheetDescription className="text-base pt-2 leading-relaxed text-slate-600">
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

            {selectedNode?.link ? (
              <a
                href={selectedNode.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-600 hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                    <ExternalLink className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      Official Documentation
                    </p>
                    <p className="text-xs text-slate-500">Master core concepts and best practices</p>
                  </div>
                </div>
              </a>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200">
                <p className="text-sm text-slate-400 italic">No additional documentation available.</p>
              </div>
            )}

            <div className="mt-12 p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mb-1">
                Architect Note
              </p>
              <p className="text-xs text-slate-500 leading-normal italic">
                Focus on fundamental understanding before proceeding to the next node. Technical depth in this area is a prerequisite for advanced career modules.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}