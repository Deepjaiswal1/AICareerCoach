// "use client"

// import React, { useContext, useEffect, useState, useRef } from "react"
// import { InterviewDataContext } from "@/context/InterviewDataContext"
// import { Mic, Phone, Timer, User, Loader2 } from "lucide-react"
// import Image from "next/image"
// import { RetellWebClient } from "retell-client-js-sdk"
// import { toast } from "sonner"
// import { useRouter } from "next/navigation"

// const retellWebClient = new RetellWebClient();

// const StartInterview = () => {
//   const router = useRouter();
//   const { interviewInfo } = useContext(InterviewDataContext)
//   const [isCallActive, setIsCallActive] = useState(false)
//   const [isConnecting, setIsConnecting] = useState(false)
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [currentCallId, setCurrentCallId] = useState(null)
  
//   const [timeLeft, setTimeLeft] = useState(0); 
//   const timerRef = useRef(null);

//   // 1. Sync duration from DB
//   useEffect(() => {
//     if (interviewInfo?.duration) {
//       const durationMins = parseInt(interviewInfo.duration, 10) || 15;
//       setTimeLeft(durationMins * 60);
//     }
//   }, [interviewInfo]);

//   // 2. Timer Countdown Logic
//   useEffect(() => {
//     if (isCallActive && timeLeft > 0) {
//       timerRef.current = setInterval(() => {
//         setTimeLeft((prev) => prev - 1);
//       }, 1000);
//     } else if (timeLeft === 0 && isCallActive) {
//       handleEndCall("Interview time has expired.");
//     }

//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [isCallActive, timeLeft]);

//   // 3. Retell Event Listeners & Gemini Console Logging
//   useEffect(() => {
//     retellWebClient.on("call_started", () => {
//       setIsCallActive(true);
//       setIsConnecting(false);
//       toast.success("Interview started! Good luck.");
//     });

//     retellWebClient.on("call_ended", async () => {
//       setIsCallActive(false);
//       setIsConnecting(false);
//       setIsProcessing(true); // Show processing UI
      
//       if (timerRef.current) clearInterval(timerRef.current);
//       toast.info("Generating Gemini AI feedback... Check console.");

//       try {
//         // We wait 4-5 seconds to ensure Retell has finished the transcript
//         await new Promise(resolve => setTimeout(resolve, 5000));

//         // Fetch the Gemini analysis from our API
//         const response = await fetch(`/api/retell/get-feedback?callId=${currentCallId}`);
//         const result = await response.json();

//         // LOG THE RESULT TO CONSOLE
//         console.log("---------- GEMINI AI FEEDBACK RESULT ----------");
//         console.log(result);
//         console.log("-----------------------------------------------");
        
//         toast.success("Feedback received! Open console to view.");
//       } catch (error) {
//         console.error("Error fetching Gemini feedback:", error);
//         toast.error("Failed to generate feedback.");
//       } finally {
//         setIsProcessing(false);
//       }
//     });

//     retellWebClient.on("error", (err) => {
//       console.error("Retell Error:", err);
//       setIsConnecting(false);
//       toast.error("Connection error. Please try again.");
//     });

//     return () => {
//       retellWebClient.stopCall();
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [currentCallId, interviewInfo]); // Removed router from deps as we aren't navigating yet

//   const formatTime = (seconds) => {
//     const totalSeconds = isNaN(seconds) || seconds < 0 ? 0 : seconds;
//     const hrs = Math.floor(totalSeconds / 3600);
//     const mins = Math.floor((totalSeconds % 3600) / 60);
//     const secs = totalSeconds % 60;
//     return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const startRetellCall = async () => {
//     if (isCallActive || isConnecting || isProcessing) return;
//     setIsConnecting(true);

//     try {
//       const response = await fetch("/api/retell/start-call", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           agentId: process.env.NEXT_PUBLIC_RETELL_AGENT_ID,
//           userName: interviewInfo?.userName,
//           userEmail: interviewInfo?.userEmail,
//           jobPosition: interviewInfo?.jobPosition,
//           questions: interviewInfo?.questions,
//           interviewId: interviewInfo?.id,
//         }),
//       });

//       const data = await response.json();
//       if (data.call_id) {
//         setCurrentCallId(data.call_id); // This is vital for the feedback call later
//         await retellWebClient.startCall({ accessToken: data.access_token });
//       } else {
//         throw new Error("No call ID received");
//       }
//     } catch (error) {
//       setIsConnecting(false);
//       toast.error("Could not connect to the AI Interviewer.");
//     }
//   };

//   const handleEndCall = (msg = "Interview session ended.") => {
//     retellWebClient.stopCall();
//     setIsCallActive(false);
//     if (timerRef.current) clearInterval(timerRef.current);
//     toast.info(msg);
//   };

//   return (
//     <div className="mt-15 p-10 md:p-20 lg:px-48 xl:px-56">
//       <h2 className="font-bold text-2xl flex justify-between items-center text-gray-800">
//         AI Interview Session
//         <span className={`flex gap-2 items-center px-5 py-2 rounded-full text-sm font-mono border shadow-sm transition-all duration-500 ${
//           isCallActive ? 'bg-blue-50 text-blue-700 border-blue-200 ring-2 ring-blue-100' : 'bg-gray-50 text-gray-400 border-gray-200 opacity-70'
//         }`}>
//           <Timer className={`h-4 w-4 ${isCallActive ? 'animate-pulse text-blue-600' : ''}`} />
//           {formatTime(timeLeft)}
//         </span>
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
//         <div className="bg-white h-[350px] rounded-3xl border-2 border-gray-100 flex flex-col items-center justify-center gap-4 shadow-sm relative overflow-hidden group">
//           {isCallActive && (
//             <div className="absolute top-4 right-4 flex items-center gap-1.5">
//               <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
//               <span className="text-[10px] font-bold text-green-600 uppercase">Live</span>
//             </div>
//           )}
//           <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-inner">
//             <Image src={"/ai.png"} alt="AI" width={60} height={60} className="w-16 h-16 object-contain" />
//           </div>
//           <div className="text-center">
//             <h2 className="font-bold text-xl text-gray-800">AI Interviewer</h2>
//             <p className="text-sm text-gray-400 font-medium">
//                 {isProcessing ? 'Analyzing with Gemini...' : isCallActive ? 'Speaking' : 'Waiting'}
//             </p>
//           </div>
//         </div>

//         <div className="bg-white h-[350px] rounded-3xl border-2 border-gray-100 flex flex-col items-center justify-center gap-5 shadow-sm">
//           <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-4xl font-extrabold shadow-lg border-4 border-white">
//             {interviewInfo?.userName?.charAt(0).toUpperCase() || <User />}
//           </div>
//           <div className="text-center px-4">
//             <h2 className="font-bold text-xl text-gray-800 truncate max-w-[200px]">{interviewInfo?.userName || "Candidate"}</h2>
//             <p className="text-sm font-bold text-purple-600 bg-purple-50 px-5 py-1.5 rounded-full mt-2 inline-block border border-purple-100 uppercase tracking-wider">
//               {interviewInfo?.jobPosition || "Job Position"}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="flex items-center justify-center mt-10 gap-7">
//         {isProcessing ? (
//             <div className="flex flex-col items-center gap-3">
//                 <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
//                 <span className="text-xs font-bold text-gray-500 uppercase">Gemini is Thinking...</span>
//             </div>
//         ) : !isCallActive ? (
//           <button onClick={startRetellCall} disabled={isConnecting} className="group flex flex-col items-center gap-2">
//             <div className="h-16 w-16 flex items-center justify-center bg-green-500 text-white rounded-full cursor-pointer border-4 border-green-100 hover:bg-green-600 transition-all shadow-lg hover:scale-110">
//               {isConnecting ? <Loader2 className="h-7 w-7 animate-spin" /> : <Mic className="h-7 w-7" />}
//             </div>
//             <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">{isConnecting ? "Connecting..." : "Start Interview"}</span>
//           </button>
//         ) : (
//           <button onClick={() => handleEndCall()} className="group flex flex-col items-center gap-2">
//             <div className="h-16 w-16 flex items-center justify-center bg-red-500 text-white rounded-full cursor-pointer border-4 border-red-100 hover:bg-red-600 transition-all shadow-lg hover:scale-110">
//               <Phone className="h-7 w-7 rotate-[135deg]" />
//             </div>
//             <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">End Session</span>
//           </button>
//         )}
//       </div>
//     </div>
//   )
// }

// export default StartInterview


"use client"

import React, { useContext, useEffect, useState, useRef } from "react"
import { InterviewDataContext } from "@/context/InterviewDataContext"
import { Mic, Phone, Timer, User, Loader2 } from "lucide-react"
import Image from "next/image"
import { RetellWebClient } from "retell-client-js-sdk"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const retellWebClient = new RetellWebClient();

const StartInterview = () => {
  const router = useRouter();
  const { interviewInfo } = useContext(InterviewDataContext)
  const [isCallActive, setIsCallActive] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentCallId, setCurrentCallId] = useState(null)
  
  const [timeLeft, setTimeLeft] = useState(0); 
  const timerRef = useRef(null);

  // 1. Sync duration from DB
  useEffect(() => {
    if (interviewInfo?.duration) {
      const durationMins = parseInt(interviewInfo.duration, 10) || 15;
      setTimeLeft(durationMins * 60);
    }
  }, [interviewInfo]);

  // 2. Timer Countdown Logic
  useEffect(() => {
    if (isCallActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isCallActive) {
      handleEndCall("Interview time has expired.");
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCallActive, timeLeft]);

  // 3. Retell Event Listeners & Database Save Logic with Redirection
  useEffect(() => {
    retellWebClient.on("call_started", () => {
      setIsCallActive(true);
      setIsConnecting(false);
      toast.success("Interview started! Good luck.");
    });

    retellWebClient.on("call_ended", async () => {
      setIsCallActive(false);
      setIsConnecting(false);
      setIsProcessing(true); 
      
      if (timerRef.current) clearInterval(timerRef.current);
      toast.info("Generating feedback and finalizing results...");

      try {
        // Wait 5 seconds for Retell to finish processing the transcript
        await new Promise(resolve => setTimeout(resolve, 5000));

        // FETCH: Calls Gemini, SAVES to Prisma, and returns the data
        const response = await fetch(
          `/api/retell/get-feedback?callId=${currentCallId}&interviewId=${interviewInfo?.id}`
        );
        
        if (!response.ok) throw new Error("Failed to process feedback");
        
        const result = await response.json();

        console.log("---------- FEEDBACK SAVED & FINALIZED ----------");
        console.log(result);
        
        toast.success("Interview results are ready!");

        // 4. REDIRECT: Move to the completed feedback page
        router.push(`/mockinterview/${interviewInfo?.id}/completed`);

      } catch (error) {
        console.error("Error saving feedback:", error);
        toast.error("Failed to save results, please check your dashboard.");
        setIsProcessing(false); // Only stop processing if it fails; otherwise, let the redirect happen
      }
    });

    retellWebClient.on("error", (err) => {
      console.error("Retell Error:", err);
      setIsConnecting(false);
      toast.error("Connection error. Please try again.");
    });

    return () => {
      retellWebClient.stopCall();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentCallId, interviewInfo, router]);

  const formatTime = (seconds) => {
    const totalSeconds = isNaN(seconds) || seconds < 0 ? 0 : seconds;
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRetellCall = async () => {
    if (isCallActive || isConnecting || isProcessing) return;
    setIsConnecting(true);

    try {
      const response = await fetch("/api/retell/start-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: process.env.NEXT_PUBLIC_RETELL_AGENT_ID,
          userName: interviewInfo?.userName,
          userEmail: interviewInfo?.userEmail,
          jobPosition: interviewInfo?.jobPosition,
          questions: interviewInfo?.questions,
          interviewId: interviewInfo?.id,
        }),
      });

      const data = await response.json();
      if (data.call_id) {
        setCurrentCallId(data.call_id);
        await retellWebClient.startCall({ accessToken: data.access_token });
      } else {
        throw new Error("No call ID received");
      }
    } catch (error) {
      setIsConnecting(false);
      toast.error("Could not connect to the AI Interviewer.");
    }
  };

  const handleEndCall = (msg = "Interview session ended.") => {
    retellWebClient.stopCall();
    setIsCallActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    toast.info(msg);
  };

  return (
    <div className="mt-15 p-10 md:p-20 lg:px-48 xl:px-56">
      <h2 className="font-bold text-2xl flex justify-between items-center text-gray-800">
        AI Interview Session
        <span className={`flex gap-2 items-center px-5 py-2 rounded-full text-sm font-mono border shadow-sm transition-all duration-500 ${
          isCallActive ? 'bg-blue-50 text-blue-700 border-blue-200 ring-2 ring-blue-100' : 'bg-gray-50 text-gray-400 border-gray-200 opacity-70'
        }`}>
          <Timer className={`h-4 w-4 ${isCallActive ? 'animate-pulse text-blue-600' : ''}`} />
          {formatTime(timeLeft)}
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
        {/* AI Interviewer Section */}
        <div className="bg-white h-[350px] rounded-3xl border-2 border-gray-100 flex flex-col items-center justify-center gap-4 shadow-sm relative overflow-hidden group">
          {isCallActive && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              <span className="text-[10px] font-bold text-green-600 uppercase">Live</span>
            </div>
          )}
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-inner">
            <Image src={"/ai.png"} alt="AI" width={60} height={60} className="w-16 h-16 object-contain" />
          </div>
          <div className="text-center">
            <h2 className="font-bold text-xl text-gray-800">AI Interviewer</h2>
            <p className="text-sm text-gray-400 font-medium">
                {isProcessing ? 'Finalizing Analysis...' : isCallActive ? 'Speaking' : 'Waiting'}
            </p>
          </div>
        </div>

        {/* Candidate Section */}
        <div className="bg-white h-[350px] rounded-3xl border-2 border-gray-100 flex flex-col items-center justify-center gap-5 shadow-sm">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-4xl font-extrabold shadow-lg border-4 border-white">
            {interviewInfo?.userName?.charAt(0).toUpperCase() || <User />}
          </div>
          <div className="text-center px-4">
            <h2 className="font-bold text-xl text-gray-800 truncate max-w-[200px]">{interviewInfo?.userName || "Candidate"}</h2>
            <p className="text-sm font-bold text-purple-600 bg-purple-50 px-5 py-1.5 rounded-full mt-2 inline-block border border-purple-100 uppercase tracking-wider">
              {interviewInfo?.jobPosition || "Job Position"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center mt-10 gap-7">
        {isProcessing ? (
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Generating Results...</span>
            </div>
        ) : !isCallActive ? (
          <button onClick={startRetellCall} disabled={isConnecting} className="group flex flex-col items-center gap-2 transition-all">
            <div className="h-16 w-16 flex items-center justify-center bg-green-500 text-white rounded-full cursor-pointer border-4 border-green-100 hover:bg-green-600 shadow-lg hover:scale-110">
              {isConnecting ? <Loader2 className="h-7 w-7 animate-spin" /> : <Mic className="h-7 w-7" />}
            </div>
            <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">{isConnecting ? "Connecting..." : "Start Interview"}</span>
          </button>
        ) : (
          <button onClick={() => handleEndCall()} className="group flex flex-col items-center gap-2 transition-all">
            <div className="h-16 w-16 flex items-center justify-center bg-red-500 text-white rounded-full cursor-pointer border-4 border-red-100 hover:bg-red-600 shadow-lg hover:scale-110">
              <Phone className="h-7 w-7 rotate-[135deg]" />
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">End Session</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default StartInterview