// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useForm, Controller } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useReactToPrint } from "react-to-print"
// import {
//   Download,
//   Edit,
//   Loader2,
//   Monitor,
//   Save,
// } from "lucide-react"
// import { toast } from "sonner"
// import MDEditor from "@uiw/react-md-editor"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Textarea } from "@/components/ui/textarea"
// import { Input } from "@/components/ui/input"
// import { saveResume } from "@/actions/resume"
// import { EntryForm } from "./entry-form"
// import useFetch from "@/hooks/use-fetch"
// import { useUser } from "@clerk/nextjs"
// import { entriesToMarkdown } from "@/app/lib/helper"
// import { resumeSchema } from "@/app/lib/schema"
// import { CategorizedSkills } from "./skills-form"

// export default function ResumeBuilder({ initialContent }) {
//   const [activeTab, setActiveTab] = useState("edit")
//   const [previewContent, setPreviewContent] = useState(initialContent)
//   const { user } = useUser()
//   const [resumeMode, setResumeMode] = useState("preview")
//   const [isGenerating, setIsGenerating] = useState(false)

//   const contentRef = useRef(null)

//   const reactToPrintFn = useReactToPrint({
//     contentRef,
//     documentTitle: `${user?.fullName?.replace(/\s+/g, "_") || "Resume"}`,
//   })

//   const handleDownload = async () => {
//     setIsGenerating(true)
//     try {
//       reactToPrintFn()
//     } catch (error) {
//       toast.error("Failed to generate PDF")
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const {
//     control,
//     handleSubmit,
//     watch,
//     register,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(resumeSchema),
//     defaultValues: {
//       firstName: "", // Added for name update
//       lastName: "",  // Added for name update
//       contactInfo: {},
//       summary: "",
//       skills: [],    // Changed to array for categorized skills
//       experience: [],
//       education: [],
//       projects: [],
//     },
//   })

//   const {
//     loading: isSaving,
//     fn: saveResumeFn,
//     data: saveResult,
//     error: saveError,
//   } = useFetch(saveResume)

//   const formValues = watch()

//   useEffect(() => {
//     if (initialContent) setActiveTab("preview")
//   }, [initialContent])

//   useEffect(() => {
//     if (activeTab === "edit") {
//       const newContent = getCombinedContent()
//       setPreviewContent(newContent ? newContent : initialContent)
//     }
//   }, [formValues, activeTab])

//   useEffect(() => {
//     if (saveResult && !isSaving) {
//       toast.success("Resume saved successfully!")
//     }
//     if (saveError) {
//       toast.error(saveError.message || "Failed to save resume")
//     }
//   }, [saveResult, saveError, isSaving])

//   const getContactMarkdown = () => {
//     const { contactInfo, firstName, lastName } = formValues
//     const parts = []
//     const fullName = (firstName || lastName) ? `${firstName} ${lastName}` : user?.fullName || "User" // Fix for "Unknown"
    
//     if (contactInfo?.email) parts.push(`📧 ${contactInfo.email}`)
//     if (contactInfo?.mobile) parts.push(`📱 ${contactInfo.mobile}`)
//     if (contactInfo?.linkedin) parts.push(`💼 [LinkedIn](${contactInfo.linkedin.startsWith('http') ? contactInfo.linkedin : 'https://' + contactInfo.linkedin})`) // URL Fix
//     if (contactInfo?.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`)

//     return parts.length > 0
//       ? `## <div align="center">${fullName}</div>\n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
//       : ""
//   }

//   const getCombinedContent = () => {
//     const { summary, skills, experience, education, projects } = formValues
    
//     // Convert array skills to markdown
//     const skillsMarkdown = Array.isArray(skills) 
//       ? skills.map(s => `**${s.category}:** ${s.skills.join(", ")}`).join("\n\n")
//       : skills

//     return [
//       getContactMarkdown(),
//       summary && `## Professional Summary\n\n${summary}`,
//       skillsMarkdown && `## Skills\n\n${skillsMarkdown}`,
//       entriesToMarkdown(experience, "Work Experience"),
//       entriesToMarkdown(education, "Education"),
//       entriesToMarkdown(projects, "Projects"),
//     ]
//       .filter(Boolean)
//       .join("\n\n")
//   }

//   const onSubmit = async () => {
//     try {
//       await saveResumeFn(previewContent)
//     } catch (error) {
//       console.error("Save error:", error)
//     }
//   }

//   return (
//     <div data-color-mode="light" className="space-y-4">
//       <div className="flex flex-col md:flex-row justify-between items-center gap-2">
//         <h1 className="font-bold gradient-title text-5xl md:text-6xl">Resume Builder</h1>
//         <div className="space-x-2">
//           <Button variant="destructive" onClick={handleSubmit(onSubmit)} disabled={isSaving}>
//             {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4 mr-2" /> Save</>}
//           </Button>
//           <Button onClick={handleDownload} disabled={isGenerating}>
//             {isGenerating ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Preparing...</> : <><Download className="h-4 w-4 mr-2" /> Download PDF</>}
//           </Button>
//         </div>
//       </div>

//       <Tabs value={activeTab} onValueChange={setActiveTab} >
//         <TabsList className={`bg-amber-300`}>
//           <TabsTrigger value="edit">Form</TabsTrigger>
//           <TabsTrigger value="preview">Markdown</TabsTrigger>
//         </TabsList>

//         <TabsContent value="edit">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Personal Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">First Name</label>
//                   <Input {...register("firstName")} placeholder="Alex" />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Last Name</label>
//                   <Input {...register("lastName")} placeholder="Rivera" />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Email</label>
//                   <Input {...register("contactInfo.email")} type="email" placeholder="your@email.com" />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Mobile Number</label>
//                   <Input {...register("contactInfo.mobile")} type="tel" placeholder="55223366411" />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">LinkedIn URL</label>
//                   <Input {...register("contactInfo.linkedin")} placeholder="linkedin.com/in/username" />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Twitter/X Profile</label>
//                   <Input {...register("contactInfo.twitter")} placeholder="twitter.com/username" />
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Professional Summary</h3>
//               <Controller
//                 name="summary"
//                 control={control}
//                 render={({ field }) => <Textarea {...field} className="h-32" placeholder="Write a professional summary..." />}
//               />
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Professional Skills</h3>
//               <Controller
//                 name="skills"
//                 control={control}
//                 render={({ field }) => (
//                   <CategorizedSkills value={field.value} onChange={field.onChange} />
//                 )}
//               />
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Work Experience</h3>
//               <Controller
//                 name="experience"
//                 control={control}
//                 render={({ field }) => <EntryForm type="Experience" entries={field.value} onChange={field.onChange} />}
//               />
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Education</h3>
//               <Controller
//                 name="education"
//                 control={control}
//                 render={({ field }) => <EntryForm type="Education" entries={field.value} onChange={field.onChange} />}
//               />
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Projects</h3>
//               <Controller
//                 name="projects"
//                 control={control}
//                 render={({ field }) => <EntryForm type="Project" entries={field.value} onChange={field.onChange} />}
//               />
//             </div>
//           </form>
//         </TabsContent>

//         <TabsContent value="preview">
//           <Button
//             variant="link"
//             type="button"
//             className="mb-2"
//             onClick={() => setResumeMode(resumeMode === "preview" ? "edit" : "preview")}
//           >
//             {resumeMode === "preview" ? <><Edit className="h-4 w-4 mr-2" /> Edit Resume</> : <><Monitor className="h-4 w-4 mr-2" /> Show Preview</>}
//           </Button>

//           <div className="border rounded-lg">
//             <MDEditor value={previewContent} onChange={setPreviewContent} height={800} preview={resumeMode} />
//           </div>

//           <div style={{ display: "none" }}>
//             <div ref={contentRef} className="p-10 bg-white text-black">
//               <MDEditor.Markdown source={previewContent} style={{ background: "white", color: "black" }} />
//             </div>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }


// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useForm, Controller } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useReactToPrint } from "react-to-print"
// import {
//   Download,
//   Edit,
//   Loader2,
//   Monitor,
//   Save,
// } from "lucide-react"
// import { toast } from "sonner"
// import MDEditor from "@uiw/react-md-editor"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Textarea } from "@/components/ui/textarea"
// import { Input } from "@/components/ui/input"
// import { saveResume } from "@/actions/resume"
// import { EntryForm } from "./entry-form"
// import useFetch from "@/hooks/use-fetch"
// import { useUser } from "@clerk/nextjs"
// import { entriesToMarkdown } from "@/app/lib/helper"
// import { resumeSchema } from "@/app/lib/schema"
// import { CategorizedSkills } from "./skills-form"

// export default function ResumeBuilder({ initialContent }) {
//   const [activeTab, setActiveTab] = useState("edit")
//   const [previewContent, setPreviewContent] = useState(initialContent)
//   const { user } = useUser()
//   const [resumeMode, setResumeMode] = useState("preview")
//   const [isGenerating, setIsGenerating] = useState(false)

//   const contentRef = useRef(null)

//   // FIXED: Improved Print Configuration to prevent contentWindow errors
//   const reactToPrintFn = useReactToPrint({
//     contentRef,
//     documentTitle: `${user?.fullName?.replace(/\s+/g, "_") || "Resume"}`,
//     onAfterPrint: () => setIsGenerating(false),
//     onPrintError: () => {
//         toast.error("Failed to generate PDF");
//         setIsGenerating(false);
//     }
//   })

//   const {
//     control,
//     handleSubmit,
//     watch,
//     register,
//   } = useForm({
//     resolver: zodResolver(resumeSchema),
//     defaultValues: {
//       firstName: "", 
//       lastName: "",  
//       contactInfo: {},
//       summary: "",
//       skills: [],    
//       experience: [],
//       education: [],
//       projects: [],
//     },
//   })

//   const {
//     loading: isSaving,
//     fn: saveResumeFn,
//     data: saveResult,
//     error: saveError,
//   } = useFetch(saveResume)

//   const formValues = watch()

//   useEffect(() => {
//     if (initialContent) setActiveTab("preview")
//   }, [initialContent])

//   // FIXED: Constant dependency array size to prevent Hook error
//   useEffect(() => {
//     if (activeTab === "edit") {
//       const newContent = getCombinedContent()
//       setPreviewContent(newContent ? newContent : initialContent)
//     }
//   }, [formValues, activeTab, initialContent]) 

//   useEffect(() => {
//     if (saveResult && !isSaving) {
//       toast.success("Resume saved successfully!")
//     }
//     if (saveError) {
//       toast.error(saveError.message || "Failed to save resume")
//     }
//   }, [saveResult, saveError, isSaving])

//   const getContactMarkdown = () => {
//     const { contactInfo, firstName, lastName } = formValues
//     const parts = []
//     const fullName = (firstName || lastName) ? `${firstName} ${lastName}` : user?.fullName || "User"
    
//     if (contactInfo?.email) parts.push(`📧 ${contactInfo.email}`)
//     if (contactInfo?.mobile) parts.push(`📱 ${contactInfo.mobile}`)
    
//     if (contactInfo?.linkedin) {
//       let url = contactInfo.linkedin.trim()
//       url = url.replace("linkdin.com", "linkedin.com")
//       if (url && !url.startsWith('http')) url = `https://${url}`
//       parts.push(`💼 [LinkedIn](${url})`)
//     }
    
//     if (contactInfo?.twitter) {
//       let url = contactInfo.twitter.trim()
//       if (url && !url.startsWith('http')) url = `https://${url}`
//       parts.push(`🐦 [Twitter](${url})`)
//     }

//     return parts.length > 0
//       ? `## <div align="center">${fullName}</div>\n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
//       : ""
//   }

//   const getCombinedContent = () => {
//     const { summary, skills, experience, education, projects } = formValues
//     const skillsMarkdown = Array.isArray(skills) 
//       ? skills.map(s => `**${s.category}:** ${s.skills.join(", ")}`).join("\n\n")
//       : ""

//     return [
//       getContactMarkdown(),
//       summary && `## Professional Summary\n\n${summary}`,
//       skillsMarkdown && `## Skills\n\n${skillsMarkdown}`,
//       entriesToMarkdown(experience, "Work Experience"),
//       entriesToMarkdown(education, "Education"),
//       entriesToMarkdown(projects, "Projects"),
//     ]
//       .filter(Boolean)
//       .join("\n\n")
//   }

//   const onSubmit = async () => {
//     try {
//       await saveResumeFn(previewContent)
//     } catch (error) {
//       console.error("Save error:", error)
//     }
//   }

//   // FIXED: Handle Download with timeout to ensure Print Ref is ready
//   const handleDownload = async () => {
//     setIsGenerating(true)
//     setTimeout(() => {
//       reactToPrintFn()
//     }, 500)
//   }

//   return (
//     <div data-color-mode="light" className="space-y-4">
//       <div className="flex flex-col md:flex-row justify-between items-center gap-2">
//         <h1 className="font-bold gradient-title text-5xl md:text-6xl">Resume Builder</h1>
//         <div className="space-x-2">
//           <Button variant="destructive" onClick={handleSubmit(onSubmit)} disabled={isSaving}>
//             {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4 mr-2" /> Save</>}
//           </Button>
//           <Button onClick={handleDownload} disabled={isGenerating}>
//             {isGenerating ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Preparing...</> : <><Download className="h-4 w-4 mr-2" /> Download PDF</>}
//           </Button>
//         </div>
//       </div>

//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="bg-amber-300">
//           <TabsTrigger value="edit">Form</TabsTrigger>
//           <TabsTrigger value="preview">Markdown</TabsTrigger>
//         </TabsList>

//         <TabsContent value="edit">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Personal Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">First Name</label>
//                   <Input {...register("firstName")} placeholder="Alex" />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Last Name</label>
//                   <Input {...register("lastName")} placeholder="Rivera" />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Email</label>
//                   <Input {...register("contactInfo.email")} type="email" placeholder="your@email.com" />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Mobile Number</label>
//                   <Input {...register("contactInfo.mobile")} type="tel" placeholder="55223366411" />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">LinkedIn URL</label>
//                   <Input {...register("contactInfo.linkedin")} placeholder="linkedin.com/in/username" />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Twitter/X Profile</label>
//                   <Input {...register("contactInfo.twitter")} placeholder="twitter.com/username" />
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Professional Summary</h3>
//               <Controller
//                 name="summary"
//                 control={control}
//                 render={({ field }) => <Textarea {...field} className="h-32" placeholder="Write a professional summary..." />}
//               />
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Professional Skills</h3>
//               <Controller
//                 name="skills"
//                 control={control}
//                 render={({ field }) => (
//                   <CategorizedSkills value={field.value} onChange={field.onChange} />
//                 )}
//               />
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Work Experience</h3>
//               <Controller
//                 name="experience"
//                 control={control}
//                 render={({ field }) => <EntryForm type="Experience" entries={field.value} onChange={field.onChange} />}
//               />
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Education</h3>
//               <Controller
//                 name="education"
//                 control={control}
//                 render={({ field }) => <EntryForm type="Education" entries={field.value} onChange={field.onChange} />}
//               />
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Projects</h3>
//               <Controller
//                 name="projects"
//                 control={control}
//                 render={({ field }) => <EntryForm type="Project" entries={field.value} onChange={field.onChange} />}
//               />
//             </div>
//           </form>
//         </TabsContent>

//         <TabsContent value="preview">
//           <Button
//             variant="link"
//             type="button"
//             className="mb-2"
//             onClick={() => setResumeMode(resumeMode === "preview" ? "edit" : "preview")}
//           >
//             {resumeMode === "preview" ? <><Edit className="h-4 w-4 mr-2" /> Edit Resume</> : <><Monitor className="h-4 w-4 mr-2" /> Show Preview</>}
//           </Button>

//           <div className="border rounded-lg">
//             <MDEditor value={previewContent} onChange={setPreviewContent} height={800} preview={resumeMode} />
//           </div>
//         </TabsContent>
//       </Tabs>

//       {/* FIXED: Print target is now Visually Hidden but in the DOM to avoid contentWindow errors */}
//       <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none">
//         <div ref={contentRef} className="p-10 bg-white text-black w-[210mm]">
//           <MDEditor.Markdown source={previewContent} style={{ background: "white", color: "black" }} />
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect, useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useReactToPrint } from "react-to-print"
import {
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
  GraduationCap,
  Briefcase,
  Layout,
} from "lucide-react"
import { toast } from "sonner"
import MDEditor from "@uiw/react-md-editor"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { saveResume } from "@/actions/resume"
import { EntryForm } from "./entry-form"
import useFetch from "@/hooks/use-fetch"
import { useUser } from "@clerk/nextjs"
import { entriesToMarkdown } from "@/app/lib/helper"
import { resumeSchema } from "@/app/lib/schema"
import { CategorizedSkills } from "./skills-form"

export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit")
  const [previewContent, setPreviewContent] = useState(initialContent)
  const { user } = useUser()
  const [resumeMode, setResumeMode] = useState("preview")
  const [isGenerating, setIsGenerating] = useState(false)

  const contentRef = useRef(null)

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `${user?.fullName?.replace(/\s+/g, "_") || "Resume"}`,
    onAfterPrint: () => setIsGenerating(false),
  })

  const {
    control,
    handleSubmit,
    watch,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      firstName: "", 
      lastName: "",  
      contactInfo: {},
      summary: "",
      skills: [],    
      experience: [],
      education: [],
      projects: [],
    },
  })

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume)

  const formValues = watch()

  useEffect(() => {
    if (initialContent) {
       setPreviewContent(initialContent)
       setActiveTab("preview")
    }
  }, [initialContent])

  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent()
      setPreviewContent(newContent || initialContent || "")
    }
  }, [formValues, activeTab, initialContent])

  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!")
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume")
    }
  }, [saveResult, saveError, isSaving])

  const getContactMarkdown = () => {
    const { contactInfo, firstName, lastName } = formValues
    const parts = []
    const fullName = (firstName || lastName) ? `${firstName} ${lastName}` : user?.fullName || "User"
    
    if (contactInfo?.email) parts.push(`📧 ${contactInfo.email}`)
    if (contactInfo?.mobile) parts.push(`📱 ${contactInfo.mobile}`)
    
    if (contactInfo?.linkedin) {
      let url = contactInfo.linkedin.trim()
      // Fixes the "linkdin" typo visible in Image 1
      url = url.replace("linkdin.com", "linkedin.com")
      if (url && !url.startsWith('http')) url = `https://${url}`
      parts.push(`💼 [LinkedIn](${url})`)
    }
    
    // Using explicit newlines (\n\n) to ensure links render as clickable blue text
    return parts.length > 0
      ? `## <div align="center">${fullName}</div>\n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>\n\n---`
      : ""
  }

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues
    const skillsMarkdown = Array.isArray(skills) 
      ? skills.map(s => `**${s.category}:** ${s.skills.join(", ")}`).join("\n\n")
      : ""

    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skillsMarkdown && `## Skills\n\n${skillsMarkdown}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"), // Fixed: Now correctly mapped to DB content field
      entriesToMarkdown(projects, "Projects"),
    ].filter(Boolean).join("\n\n")
  }

  const onSubmit = async () => {
    try {
      const contentToSave = activeTab === "edit" ? getCombinedContent() : previewContent
      await saveResumeFn(contentToSave)
    } catch (error) {
      toast.error("An error occurred while saving")
    }
  }

  // Debugger to find why Save might not trigger
  const onInvalid = (errors) => {
    console.error("Form Validation Errors:", errors)
    toast.error("Validation failed. Check required fields.")
  }

  const handleDownload = async () => {
    setIsGenerating(true)
    setTimeout(() => { reactToPrintFn() }, 500)
  }

  return (
    <div data-color-mode="light" className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">Resume Builder</h1>
        <div className="space-x-2">
          <Button 
            variant="destructive" 
            onClick={handleSubmit(onSubmit, onInvalid)} 
            disabled={isSaving}
          >
            {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4 mr-2" /> Save</>}
          </Button>
          <Button onClick={handleDownload} disabled={isGenerating}>
            {isGenerating ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Preparing...</> : <><Download className="h-4 w-4 mr-2" /> Download PDF</>}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-amber-300">
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                <Input {...register("firstName")} placeholder="First Name" />
                <Input {...register("lastName")} placeholder="Last Name" />
                <Input {...register("contactInfo.email")} placeholder="Email" />
                <Input {...register("contactInfo.linkedin")} placeholder="LinkedIn URL" />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Summary</h3>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => <Textarea {...field} className="h-32" />}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Skills</h3>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => <CategorizedSkills value={field.value} onChange={field.onChange} />}
              />
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-medium">Work Experience</h3>
              </div>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => <EntryForm type="Experience" entries={field.value} onChange={field.onChange} />}
              />
            </div>

            {/* FIXED: Education Section Restored and bound to Form State */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-medium">Education</h3>
              </div>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <EntryForm type="Education" entries={field.value || []} onChange={field.onChange} />
                )}
              />
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Layout className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-medium">Projects</h3>
              </div>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => <EntryForm type="Project" entries={field.value} onChange={field.onChange} />}
              />
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preview">
          <Button variant="link" onClick={() => setResumeMode(resumeMode === "preview" ? "edit" : "preview")}>
            {resumeMode === "preview" ? "Edit Resume" : "Show Preview"}
          </Button>
          <div className="border rounded-lg">
            <MDEditor value={previewContent} onChange={setPreviewContent} height={800} preview={resumeMode} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Visually hidden container for react-to-print */}
      <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none">
        <div ref={contentRef} className="p-10 bg-white text-black w-[210mm]">
          <MDEditor.Markdown source={previewContent} style={{ background: "white", color: "black" }} />
        </div>
      </div>
    </div>
  )
}