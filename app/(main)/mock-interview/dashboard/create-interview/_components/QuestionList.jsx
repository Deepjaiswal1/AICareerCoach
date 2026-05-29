// "use client"; // Ensure this is a client component

// import { Button } from "@/components/ui/button";
// import { Loader2Icon } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { createMockInterview } from "@/actions/mock-interview"; // Import your server action

// const QuestionList = ({ formData }) => {
//   const [loading, setLoading] = useState(false);
//   const [questions, setQuestions] = useState([]);
//   const [interviewId, setInterviewId] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     // Automatically trigger generation when formData is valid and we haven't generated yet
//     if (formData?.jobPosition && questions.length === 0 && !loading) {
//       handleGenerate();
//     }
//   }, [formData]);

//   const handleGenerate = async () => {
//     setLoading(true);
//     try {
//       // 1. Call the Server Action (which handles Gemini + Prisma)
//       const result = await createMockInterview(formData);

//       if (result.success) {
//         // 2. Set the questions and store the ID for the "Finish" button
//         setQuestions(result.data.questions);
//         setInterviewId(result.data.id);
//         toast.success("Interview questions generated and saved!");
//       } else {
//         throw new Error(result.error);
//       }
//     } catch (e) {
//       console.error("Generation Error:", e);
//       toast.error("Failed to generate questions. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onFinish = () => {
//     if (interviewId) {
//       // Redirect to the actual practice page using the stored ID
//       router.push(`/dashboard/mock-interview/${interviewId}`);
//     } else {
//       toast.error("No interview data found to finish.");
//     }
//   };

//   return (
//     <div className="mt-5">
//       {loading ? (
//         <div className="p-10 bg-blue-50 rounded-xl border-2 border-dashed border-blue-200 flex flex-col gap-5 items-center justify-center">
//           <Loader2Icon className="animate-spin text-blue-600 h-10 w-10" />
//           <div className="text-center">
//             <h2 className="font-bold text-xl text-blue-800">Architecting Your Interview...</h2>
            // <p className="text-sm text-blue-600 mt-2">
            //   Our AI is analyzing the job description for <strong>{formData?.jobPosition}</strong>.
            // </p>
//           </div>
//         </div>
//       ) : questions.length > 0 ? (
//         <div>
//           <div className="flex justify-between items-center mb-5">
//             <h2 className="font-bold text-xl text-gray-800">
//               📋 Personalized Interview Plan
//             </h2>
//             <span className="text-sm font-medium text-gray-500">
//               {questions.length} Questions Prepared
//             </span>
//           </div>

//           <div className="grid grid-cols-1 gap-4 border border-gray-200 p-6 rounded-xl bg-white shadow-sm">
//             {questions.map((item, index) => (
//               <div
//                 key={index}
//                 className="p-4 border-l-4 border-blue-500 bg-gray-50 rounded-r-xl hover:bg-blue-50 transition-colors"
//               >
//                 <div className="flex justify-between items-start">
//                    <h3 className="font-semibold text-gray-800 flex-1">{item.question}</h3>
//                    <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded ml-4 border border-blue-200">
//                     {item.type}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-end mt-10 gap-3">
//             <Button
//               variant="outline"
//               onClick={() => window.location.reload()}
//               disabled={loading}
//             >
//               Regenerate
//             </Button>
//             <Button
//               onClick={onFinish}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-8 font-bold"
//             >
//               Start Practice Session
//             </Button>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// };

// export default QuestionList;

"use client"

import { Button } from "@/components/ui/button"
import { Loader2Icon, CheckCircle2 } from "lucide-react"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import { createMockInterview } from "@/actions/mock-interview"

const QuestionList = ({ formData, onCreateLink }) => {
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    if (formData?.jobPosition && questions.length === 0) {
      GenerateAIQuestions()
    }
  }, [formData])

  const GenerateAIQuestions = async () => {
    setLoading(true)
    try {
      // 1. Prepare the selected types string for the prompt
      const selectedTypes = Array.isArray(formData?.type) 
        ? formData.type.join(", ") 
        : formData?.type;

      // 2. We send the formData which contains 'type' to the API
      // Ensure your /api/ai-model/route.js uses this 'type' field in the system prompt
      const result = await axios.post("/api/ai-model", {
        ...formData,
        type: selectedTypes // Explicitly passing formatted types
      })
      
      const rawJson = result.data.content
      const parsedData = JSON.parse(
        rawJson.replace(/```json/g, "").replace(/```/g, ""),
      )
      
      const generatedQuestions = parsedData.interviewQuestions || parsedData;

      // 3. SECONDARY CLIENT-SIDE FILTER (Safety Net)
      // This ensures that even if the AI "hallucinates" a wrong type, it won't show to the user
      const filtered = generatedQuestions.filter(q => 
        selectedTypes.toLowerCase().includes(q.type.toLowerCase())
      );

      setQuestions(filtered.length > 0 ? filtered : generatedQuestions)
      
    } catch (e) {
      console.error(e)
      toast.error("AI failed to craft questions.")
    } finally {
      setLoading(false)
    }
  }

  // ... onSaveToDatabase logic remains the same
  const onSaveToDatabase = async () => {
    if (questions.length === 0) return
    setIsSaving(true)
    try {
      const result = await createMockInterview({
        ...formData,
        questions: questions,
      })
      if (result.success) {
        setIsSaved(true)
        toast.success("Interview session successfully saved!")
        if (onCreateLink && result.data?.id) {
          onCreateLink(result.data.id)
        }
      } else {
        throw new Error(result.error)
      }
    } catch (e) {
      console.error(e)
      toast.error("Failed to save session.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mt-5">
      {loading ? (
        <div className="p-10 bg-blue-50 rounded-xl border-2 border-dashed border-blue-200 flex flex-col gap-5 items-center justify-center">
          <Loader2Icon className="animate-spin text-blue-600 h-10 w-10" />
          <h2 className="font-bold text-xl text-blue-800">Architecting Questions...</h2>
           <p className="text-sm text-blue-600 mt-2 text-center">
             Generating <strong>{Array.isArray(formData?.type) ? formData.type.join(" & ") : formData?.type}</strong> questions for {formData?.jobPosition}.
           </p>
        </div>
      ) : (
        <div className="space-y-6">
           {/* UI Rendering logic... */}
           <div className="grid grid-cols-1 gap-4 border border-gray-200 p-6 rounded-xl bg-white shadow-sm">
            {questions.map((item, index) => (
              <div key={index} className="p-4 border-l-4 border-blue-500 bg-gray-50 rounded-r-xl">
                <h3 className="font-semibold text-gray-800">{item.question}</h3>
                <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded mt-2 inline-block">
                  {item.type}
                </span>
              </div>
            ))}
          </div>
          {/* Action Buttons... */}
          <div className="flex justify-end items-center gap-4">
            {isSaved ? (
              <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                <CheckCircle2 className="h-5 w-5" /> Saved to Database
              </div>
            ) : (
              <Button onClick={onSaveToDatabase} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white px-8 font-bold">
                {isSaving ? <><Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Create Interview Link & Save"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestionList