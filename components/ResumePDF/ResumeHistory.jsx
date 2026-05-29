// "use client";

// import { useEffect, useState } from "react";
// import { getResumeHistory } from "@/actions/resume";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { FileText, Calendar, ArrowRight, Loader2 } from "lucide-react";
// import Link from "next/link";
// import { format } from "date-fns";

// export function ResumeHistory() {
//   const [resumes, setResumes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchHistory = async () => {
//       const res = await getResumeHistory();
//       if (res.success) setResumes(res.data);
//       setLoading(false);
//     };
//     fetchHistory();
//   }, []);

//   if (loading) return <Loader2 className="animate-spin mx-auto mt-10" />;

//   if (resumes.length === 0) {
//     return (
//       <div className="text-center p-10 border-2 border-dashed rounded-2xl">
//         <p className="text-slate-500">No resumes found. Start building one!</p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {resumes.map((resume) => (
//         <Card key={resume.id} className="hover:shadow-md transition-shadow border-2 shadow-none rounded-2xl">
//           <CardHeader className="flex flex-row items-center space-x-4 pb-2">
//             <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
//               <FileText size={24} />
//             </div>
//             <div>
//               <CardTitle className="text-base">
//                 {resume.content?.contact?.name || "Untitled Resume"}
//               </CardTitle>
//               <div className="flex items-center text-xs text-slate-400 mt-1">
//                 <Calendar size={12} className="mr-1" />
//                 {format(new Date(resume.updatedAt), "PPP")}
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent className="pt-4">
//              <Link href={`/resume/${resume.id}`}>
//                <Button variant="secondary" className="w-full justify-between group">
//                  Edit Resume
//                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//                </Button>
//              </Link>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { getResumeHistory } from "@/actions/resume";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, ArrowRight, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";

export function ResumeHistory() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getResumeHistory();
        if (res.success) {
          setResumes(res.data);
        } else {
          toast.error("Failed to load your resumes");
        }
      } catch (error) {
        toast.error("An error occurred while fetching history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-indigo-600 h-10 w-10" />
        <p className="text-slate-500 mt-4 font-medium">Loading your archives...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 1. "CREATE NEW" CARD */}
      <Link href="/resume">
        <Card className="h-full border-2 border-dashed hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group flex flex-col items-center justify-center p-6 min-h-[160px]">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full group-hover:scale-110 transition-transform">
            <Plus size={24} />
          </div>
          <p className="mt-3 font-bold text-slate-700">New Resume</p>
        </Card>
      </Link>

      {/* 2. SAVED RESUMES */}
      {resumes.map((resume) => (
        <Card 
          key={resume.id} 
          className="hover:shadow-xl hover:-translate-y-1 transition-all border-2 shadow-none rounded-2xl overflow-hidden flex flex-col justify-between"
        >
          <CardHeader className="flex flex-row items-start space-x-4 pb-4">
            <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl">
              <FileText size={20} />
            </div>
            <div className="flex-1 overflow-hidden">
              <CardTitle className="text-base truncate font-bold text-slate-900">
                {resume.content?.contact?.name || "Untitled Candidate"}
              </CardTitle>
              <div className="flex items-center text-[11px] text-slate-400 mt-1 font-medium">
                <Calendar size={12} className="mr-1" />
                {format(new Date(resume.updatedAt), "MMM do, yyyy")}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Quick Preview of summary or role if available */}
            <p className="text-xs text-slate-500 line-clamp-2 mb-4 italic">
              {resume.content?.experience?.[0]?.role || "No role specified"}
            </p>
            
            <Link href={`/resume-builder?id=${resume.id}`}>
              <Button variant="secondary" className="w-full justify-between group bg-slate-50 hover:bg-indigo-600 hover:text-white border-none rounded-xl font-bold">
                Continue Editing
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}