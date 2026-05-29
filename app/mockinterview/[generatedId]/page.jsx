// "use client"
// import React, { useContext, useEffect, useState } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { toast } from "sonner"
// import { getInterviewDetailsById } from "@/actions/mock-interview"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Clock, Info, Video, Loader2Icon, Tag } from "lucide-react"
// import Image from "next/image"
// import { InterviewDataContext } from "@/context/InterviewDataContext"

// const MockPage = () => {
//   const { generatedId } = useParams()
//   const router = useRouter()

//   const [interviewData, setInterviewData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [userName, setUserName] = useState("")
//   const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext)

//   useEffect(() => {
//     if (generatedId) {
//       GetInterviewDetails()
//     }
//   }, [generatedId])

//   /**
//    * Fetches the specific interview details (Job info + AI Questions)
//    * from the database using the ID from the URL.
//    */
//   const GetInterviewDetails = async () => {
//     try {
//       setLoading(true)
//       const result = await getInterviewDetailsById(generatedId)

//       if (result.success) {
//         setInterviewData(result.data)
//       } else {
//         toast.error("Interview session not found.")
//       }
//     } catch (error) {
//       console.error("Error fetching interview:", error)
//       toast.error("Failed to load interview details.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   /**
//    * Validates user input and navigates to the practice area
//    */
//   const onJoinInterview = () => {
//     if (!userName || userName.trim().length < 2) {
//       toast.error("Please enter your name to start the session.")
//       return
//     }

//     // 2. Log all data to the browser console for debugging
//     console.log("================ INTERVIEW DEBUG INFO ================")
//     console.log("Candidate Name:", userName)
//     console.log("Interview ID:", generatedId)
//     console.log("Job Position:", interviewData?.jobPosition)
//     console.log("Job Description:", interviewData?.jobDescription)
//     console.log("Interview Type:", interviewData?.type)

//     // This is the most important part to check
//     console.log("AI Generated Questions:", interviewData?.questions)
//     console.log("======================================================")

//     // Verify questions exist before moving forward
//     if (!interviewData?.questions || interviewData.questions.length === 0) {
//       toast.error("Questions are still loading or missing. Please refresh.")
//       return
//     }

//     setInterviewInfo({
//       ...interviewData,
//       userName: userName,
//     })

//     // Store candidate name for the AI to greet them later
//     localStorage.setItem("candidateName", userName)

//     toast.success(`Welcome, ${userName}! Preparing your session...`)

//     // Redirect to the practice page
//     router.push(`/mockinterview/${generatedId}/start`)
//   }

//   if (loading) {
//     return (
//       <div className="flex h-screen flex-col items-center justify-center gap-4">
//         <Loader2Icon className="animate-spin h-12 w-12 text-blue-500" />
//         <p className="text-gray-900 font-medium">
//           Fetching Interview Details...
//         </p>
//       </div>
//     )
//   }

//   return (
//     <div className="mt-15 px-10 md:px-28 lg:px-48 xl:px-70">
//       <div className="flex flex-col items-center justify-center border rounded-2xl bg-white p-8 lg:px-20 shadow-xl mb-10 transition-all">
//         <Image
//           src={"/mocklogo3.png"}
//           alt="logo"
//           width={220}
//           height={220}
//           priority
//         />

//         <h2 className="mt-4 text-gray-400 tracking-widest uppercase text-xs font-bold">
//           AI-Powered Interview Platform
//         </h2>

//         <Image
//           src={`/interview.png`}
//           alt="interview illustration"
//           width={400}
//           height={400}
//           className="w-64 my-8 hover:scale-105 transition-transform"
//         />

//         {/* Dynamic Header */}
//         <div className="text-center space-y-2">
//           <h2 className="font-extrabold text-3xl text-gray-800">
//             {interviewData?.jobPosition} Interview
//           </h2>
//           {/* <p className="text-gray-500 text-sm max-w-md mx-auto italic">
//             "{interviewData?.jobDescription}"
//           </p> */}
//         </div>

//         {/* Meta Info Tags */}
//         <div className="flex flex-wrap justify-center gap-4 mt-6">
//           <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full border border-blue-100 text-sm font-semibold">
//             <Clock className="h-4 w-4" />
//             {interviewData?.duration}
//           </div>
//           <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full border border-purple-100 text-sm font-semibold">
//             <Tag className="h-4 w-4" />
//             <span className="capitalize">
//               {Array.isArray(interviewData?.type)
//                 ? interviewData.type.join(", ")
//                 : interviewData?.type}
//             </span>
//           </div>
//         </div>

//         {/* Name Input Area */}
//         <div className="w-full mt-10 space-y-3">
//           <label className="font-bold text-gray-700 ml-1">
//             Enter your full name
//           </label>
//           <Input
//             className="h-12 text-lg border-2 focus-visible:ring-blue-500"
//             placeholder="e.g. John Smith"
//             value={userName}
//             onChange={(event) => setUserName(event.target.value)}
//           />
//         </div>

//         {/* Instructions Box */}
//         <div className="p-5 bg-blue-50/50 flex gap-4 rounded-xl mt-8 border border-blue-100 w-full">
//           <Info className="text-blue-600 h-6 w-6 shrink-0" />
//           <div>
//             <h2 className="font-bold text-blue-900">Before you begin</h2>
//             <ul className="list-disc list-inside text-sm text-blue-800 mt-2 space-y-1">
//               <li>Ensure you have a stable Internet Connection</li>
//               <li>Allow Camera and Microphone permissions when prompted</li>
//               <li>Find a quiet place to avoid AI interference</li>
//             </ul>
//           </div>
//         </div>

//         {/* Action Button */}
//         <Button
//           onClick={onJoinInterview}
//           disabled={!userName || userName.trim().length < 2}
//           className="bg-blue-600 hover:bg-blue-700 mt-10 w-full font-bold h-14 text-lg shadow-lg shadow-blue-200 transition-all active:scale-95"
//         >
//           <Video className="mr-3 h-5 w-5" /> Join AI Interview
//         </Button>
//       </div>
//     </div>
//   )
// }

// export default MockPage


"use client"

import React, { useContext, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { getInterviewDetailsById } from "@/actions/mock-interview"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Clock, Info, Video, Loader2Icon, Tag, Mail } from "lucide-react" // Added Mail icon
import Image from "next/image"
import { InterviewDataContext } from "@/context/InterviewDataContext"

const MockPage = () => {
  const { generatedId } = useParams()
  const router = useRouter()

  const [interviewData, setInterviewData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("") // NEW: Email State
  const { setInterviewInfo } = useContext(InterviewDataContext)

  useEffect(() => {
    if (generatedId) {
      GetInterviewDetails()
    }
  }, [generatedId])

  const GetInterviewDetails = async () => {
    try {
      setLoading(true)
      const result = await getInterviewDetailsById(generatedId)
      if (result.success) {
        setInterviewData(result.data)
      } else {
        toast.error("Interview session not found.")
      }
    } catch (error) {
      console.error("Error fetching interview:", error)
      toast.error("Failed to load interview details.")
    } finally {
      setLoading(false)
    }
  }

  const onJoinInterview = () => {
    // Validation for Name and Email
    if (!userName || userName.trim().length < 2) {
      toast.error("Please enter your name.")
      return
    }
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.")
      return
    }

    if (!interviewData?.questions || interviewData.questions.length === 0) {
      toast.error("Questions are still loading. Please refresh.")
      return
    }

    // UPDATED: Passing both userName and email to Context
    setInterviewInfo({
      ...interviewData,
      userName: userName,
      userEmail: email, // Passing Email to Context
    })

    // LocalStorage backup
    localStorage.setItem("candidateName", userName)
    localStorage.setItem("candidateEmail", email)

    toast.success(`Welcome, ${userName}! Preparing your session...`)
    router.push(`/mockinterview/${generatedId}/start`)
  }

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <Loader2Icon className="animate-spin h-12 w-12 text-blue-500" />
        <p className="text-gray-900 font-medium">Fetching Interview Details...</p>
      </div>
    )
  }

  return (
    <div className="mt-15 px-10 md:px-28 lg:px-48 xl:px-70">
      <div className="flex flex-col items-center justify-center border rounded-2xl bg-white p-8 lg:px-20 shadow-xl mb-10 transition-all">
        <Image src={"/mocklogo3.png"} alt="logo" width={220} height={220} priority />

        <h2 className="mt-4 text-gray-400 tracking-widest uppercase text-xs font-bold">
          AI-Powered Interview Platform
        </h2>

        <Image
          src={`/interview.png`}
          alt="interview illustration"
          width={400}
          height={400}
          className="w-64 my-8 hover:scale-105 transition-transform"
        />

        <div className="text-center space-y-2">
          <h2 className="font-extrabold text-3xl text-gray-800">
            {interviewData?.jobPosition} Interview
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full border border-blue-100 text-sm font-semibold">
            <Clock className="h-4 w-4" />
            {interviewData?.duration}
          </div>
          <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full border border-purple-100 text-sm font-semibold">
            <Tag className="h-4 w-4" />
            <span className="capitalize">
              {Array.isArray(interviewData?.type) ? interviewData.type.join(", ") : interviewData?.type}
            </span>
          </div>
        </div>

        {/* INPUT AREA */}
        <div className="w-full mt-10 space-y-5">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="font-bold text-gray-700 ml-1">Full Name</label>
            <Input
              className="h-12 text-lg border-2 focus-visible:ring-blue-500"
              placeholder="e.g. John Smith"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
            />
          </div>

          {/* Email Input - NEW */}
          <div className="space-y-2">
            <label className="font-bold text-gray-700 ml-1">Email Address</label>
            <Input
              type="email"
              className="h-12 text-lg border-2 focus-visible:ring-blue-500"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>

        <div className="p-5 bg-blue-50/50 flex gap-4 rounded-xl mt-8 border border-blue-100 w-full">
          <Info className="text-blue-600 h-6 w-6 shrink-0" />
          <div>
            <h2 className="font-bold text-blue-900">Before you begin</h2>
            <ul className="list-disc list-inside text-sm text-blue-800 mt-2 space-y-1">
              <li>Ensure you have a stable Internet Connection</li>
              <li>Find a quiet place to avoid AI interference</li>
            </ul>
          </div>
        </div>

        <Button
          onClick={onJoinInterview}
          disabled={!userName || userName.trim().length < 2 || !email}
          className="bg-blue-600 hover:bg-blue-700 mt-10 w-full font-bold h-14 text-lg shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <Video className="mr-3 h-5 w-5" /> Join AI Interview
        </Button>
      </div>
    </div>
  )
}

export default MockPage