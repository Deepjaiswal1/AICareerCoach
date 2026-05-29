// "use client"
// import React, { use, useEffect, useState } from "react"
// import { useUser } from "@clerk/nextjs"
// import { Progress } from "@/components/ui/progress"
// import { Badge } from "@/components/ui/badge"
// import { Loader2, CheckCircle, AlertCircle, Lightbulb } from "lucide-react"

// const InterviewDetailsPage = ({ params }) => {
//   const { user, isLoaded: userLoaded } = useUser();
//   const resolvedParams = use(params);
//   const interviewId = resolvedParams?.interviewId;
  
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDetails = async () => {
//       if (!interviewId || !user?.id) return;
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/mock-interview/${interviewId}?clerkId=${user.id}`);
//         const result = await res.json();
//         setData(result);
//       } catch (err) {
//         console.error("Fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (userLoaded) fetchDetails();
//   }, [interviewId, user?.id, userLoaded]);

//   if (loading || !userLoaded) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;
//   if (!data) return <div className="p-20 text-center">No record found.</div>;

//   // --- LOGIC FIXES BASED ON YOUR LOGS ---
  
//   // 1. Name Fix: Priority -> candidateName (Deepak) then user.name (Unknown null)
//   const displayName = data.candidateName || data.user?.name || "Candidate";

//   // 2. Feedback Nesting Fix: Your log shows data.feedback.feedback.rating
//   const feedbackContent = data.feedback?.feedback || data.feedback || {};
//   const ratings = feedbackContent.rating || {};
//   const questions = data.questions || [];

//   return (
//     <div className="p-10 max-w-7xl mx-auto">
//       {/* Sidebar Score Card */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 space-y-6">
//           <h1 className="text-3xl font-bold">Report for {displayName}</h1>
//           <p className="text-blue-600 font-bold">{data.jobPosition}</p>
          
//           <div className="space-y-4 mt-8">
//              <h3 className="text-xl font-bold">Question Feedback</h3>
//              {questions.map((q, i) => (
//                <div key={i} className="p-5 border rounded-xl bg-white shadow-sm">
//                  <p className="font-bold mb-2 text-gray-800">Q{i+1}: {q.question}</p>
//                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{q.type}</Badge>
//                </div>
//              ))}
//           </div>
//         </div>

//         <div className="lg:col-span-1 space-y-6">
//           <div className="bg-white p-6 rounded-2xl border shadow-lg">
//             <h2 className="text-xl font-bold mb-4 border-b pb-2">Scores</h2>
            
//             {/* Using the double-nested rating data */}
//             <ScoreItem label="Technical Skills" value={ratings.technicalSkills} />
//             <ScoreItem label="Problem Solving" value={ratings.problemSolving} />
//             <ScoreItem label="Communication" value={ratings.communication} />
//             <ScoreItem label="Experience" value={ratings.experience} />

//             <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
//                <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
//                  <Lightbulb className="h-4 w-4 text-amber-500" /> AI Summary
//                </h4>
//                <p className="text-xs leading-relaxed text-gray-600">
//                  {feedbackContent.summary || "No summary available."}
//                </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ScoreItem = ({ label, value }) => (
//   <div className="mb-4">
//     <div className="flex justify-between text-xs font-bold mb-1">
//       <span>{label}</span>
//       <span>{value || 0}/10</span>
//     </div>
//     <Progress value={(value || 0) * 10} className="h-1" />
//   </div>
// );

// export default InterviewDetailsPage;

"use client"
import React, { use, useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb, 
  ThumbsUp, 
  ThumbsDown,
  ChevronLeft
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const InterviewDetailsPage = ({ params }) => {
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();
  const resolvedParams = use(params);
  const interviewId = resolvedParams?.interviewId;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!interviewId || !user?.id) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/mock-interview/${interviewId}?clerkId=${user.id}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userLoaded) fetchDetails();
  }, [interviewId, user?.id, userLoaded]);

  if (loading || !userLoaded) return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
    </div>
  );

  if (!data) return <div className="p-20 text-center">No record found.</div>;

  // --- LOGIC MAPPING (Matches your specific JSON logs) ---
  const displayName = data.candidateName || data.user?.name || "Candidate";
  const feedbackContent = data.feedback?.feedback || data.feedback || {};
  const ratings = feedbackContent.rating || {};
  const questions = data.questions || [];
  
  // Recommendation logic
  const isRecommended = feedbackContent.Recommendation === "Yes";

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-6 flex gap-2 items-center text-gray-600"
      >
        <ChevronLeft className="h-4 w-4" /> Back to History
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Report & Questions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border shadow-sm">
            <Badge className="mb-2 bg-blue-50 text-blue-700 border-blue-200 uppercase tracking-wider">
              {data.status} Report
            </Badge>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Report for {displayName}</h1>
            <p className="text-lg text-blue-600 font-semibold mb-6">{data.jobPosition}</p>
            
            <div className="space-y-6 mt-10">
               <h3 className="text-xl font-bold flex items-center gap-2 italic">
                 <CheckCircle className="text-gray-400 h-5 w-5" /> Interview Transcript & Q&A
               </h3>
               {questions.map((q, i) => (
                 <div key={i} className="p-6 border rounded-xl bg-gray-50/50 hover:border-blue-200 transition-all">
                   <div className="flex justify-between items-start mb-3">
                     <span className="text-xs font-black text-blue-500 uppercase">Question {i+1}</span>
                     <Badge variant="outline" className="text-[10px]">{q.type}</Badge>
                   </div>
                   <p className="font-bold text-gray-800 leading-snug">{q.question}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Scores & Recommendation */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Recommendation Card */}
          <div className={`p-6 rounded-2xl border-2 shadow-lg transition-all ${
            isRecommended ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${isRecommended ? "text-green-900" : "text-orange-900"}`}>
                AI Recommendation
              </h2>
              {isRecommended ? (
                <ThumbsUp className="h-6 w-6 text-green-600" />
              ) : (
                <ThumbsDown className="h-6 w-6 text-orange-600" />
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-3">
               <Badge className={isRecommended ? "bg-green-600" : "bg-orange-600"}>
                 {isRecommended ? "HIRE / RECOMMEND" : "NEEDS IMPROVEMENT"}
               </Badge>
            </div>

            <p className={`text-sm leading-relaxed mb-2 font-medium ${isRecommended ? "text-green-800" : "text-orange-800"}`}>
              {feedbackContent.RecommendationMsg || "No specific recommendation message provided."}
            </p>
          </div>

          {/* Scores Card */}
          <div className="bg-white p-6 rounded-2xl border shadow-lg space-y-6">
            <h3 className="text-lg font-bold border-b pb-2">Competency Scores</h3>
            <ScoreItem label="Technical Skills" value={ratings.technicalSkills} />
            <ScoreItem label="Problem Solving" value={ratings.problemSolving} />
            <ScoreItem label="Communication" value={ratings.communication} />
            <ScoreItem label="Experience" value={ratings.experience} />
            
            <div className="mt-6 pt-4 border-t">
               <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-gray-700">
                 <Lightbulb className="h-4 w-4 text-amber-500" /> Performance Summary
               </h4>
               <p className="text-xs leading-relaxed text-gray-500 italic whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border">
                 {feedbackContent.summary || "No summary available."}
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const ScoreItem = ({ label, value }) => (
  <div className="mb-4">
    <div className="flex justify-between text-[11px] font-bold mb-1 uppercase text-gray-500">
      <span>{label}</span>
      <span className="text-blue-600">{value || 0}/10</span>
    </div>
    <Progress value={(Number(value) || 0) * 10} className="h-1.5 bg-gray-100" />
  </div>
);

export default InterviewDetailsPage;