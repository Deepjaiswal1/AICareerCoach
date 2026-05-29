
// "use client"

// import { useState, useEffect } from "react"
// import { useForm, useFieldArray } from "react-hook-form"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Card } from "@/components/ui/card"
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet"
// import {
//   User,
//   Briefcase,
//   GraduationCap,
//   Code2,
//   FolderGit2,
//   Trash2,
//   Sparkles,
//   Save,
//   Download,
//   Loader2,
//   Plus,
//   Mail,
//   Phone,
//   MapPin,
//   Github,
//   History,
//   RotateCcw,
//   LocationEdit,
// } from "lucide-react"
// import { improveWithAI, saveResume, getResumeHistoryy } from "@/actions/resume" // Fixed typo
// import { toast } from "sonner"
// import { PDFDownloadLink } from "@react-pdf/renderer"
// import { ResumePDF } from "@/components/ResumePDF/ResumePDF"

// export default function ResumeBuilderPage({ initialData }) {
//   const [activeTab, setActiveTab] = useState("contact")
//   const [isImproving, setIsImproving] = useState(false)
//   const [isSaving, setIsSaving] = useState(false)
//   const [isClient, setIsClient] = useState(false)
//   const [history, setHistory] = useState([])
//   const [selectedVersion, setSelectedVersion] = useState(null)

//   // Function to trigger the database fetch
//   const fetchHistory = async () => {
//     const res = await getResumeHistoryy() // Fixed typo
//     if (res.success) {
//       setHistory(res.data)
//     } else {
//       toast.error("Could not load history")
//     }
//   }

//   useEffect(() => setIsClient(true), [])

//   const { register, control, watch, setValue, reset } = useForm({
//     // Added reset
//     defaultValues: initialData || {
//       contact: { name: "", email: "", phone: "", location: "", github: "" },
//       summary: "",
//       experience: [{ company: "", role: "", description: "" }],
//       education: [{ school: "", degree: "", year: "" }],
//       projects: [{ name: "", description: "", link: "" }],
//       skills: "",
//     },
//   })

//   const resumeData = watch()

//   const {
//     fields: expFields,
//     append: addExp,
//     remove: remExp,
//   } = useFieldArray({ control, name: "experience" })
//   const {
//     fields: eduFields,
//     append: addEdu,
//     remove: remEdu,
//   } = useFieldArray({ control, name: "education" })
//   const {
//     fields: projFields,
//     append: addProj,
//     remove: remProj,
//   } = useFieldArray({ control, name: "projects" })

//   const handleSave = async () => {
//     setIsSaving(true)
//     const res = await saveResume(resumeData)
//     res.success
//       ? toast.success("Saved to Database!")
//       : toast.error("Save failed")
//     setIsSaving(false)
//   }

//   const handleAIImprove = async (index, type) => {
//     let currentText = ""
//     if (type === "experience")
//       currentText = watch(`experience.${index}.description`)
//     else if (type === "project")
//       currentText = watch(`projects.${index}.description`)
//     else if (type === "summary") currentText = watch("summary")

//     if (!currentText) return toast.error("Please enter some text first")

//     setIsImproving(true)
//     try {
//       const improved = await improveWithAI({ current: currentText, type })
//       if (type === "experience")
//         setValue(`experience.${index}.description`, improved)
//       else if (type === "project")
//         setValue(`projects.${index}.description`, improved)
//       else if (type === "summary") setValue("summary", improved)
//       toast.success("AI Enhancement Applied!")
//     } catch (error) {
//       toast.error("AI enhancement failed")
//     } finally {
//       setIsImproving(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       {/* HEADER SECTION */}
//       <header className="bg-slate-50 border-b py-6 sticky top-0 z-50">
//         <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
//           <h1 className="text-xl font-black tracking-tighter text-slate-900">
//             RESUME<span className="text-indigo-600">ARCHITECT</span>
//           </h1>
//           <div className="flex gap-3">
//             <Sheet onOpenChange={(open) => open && fetchHistory()}>
//               <SheetTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="rounded-xl border-2 font-bold"
//                 >
//                   <History className="h-4 w-4 mr-2" /> History
//                 </Button>
//               </SheetTrigger>
//               <SheetContent className="overflow-y-auto">
//                 <SheetHeader>
//                   <SheetTitle>Resume Archives</SheetTitle>
//                 </SheetHeader>
//                 <div className="mt-6 space-y-4">
//                   {history.length === 0 && (
//                     <p className="text-slate-400 text-sm text-center">
//                       No saved versions found.
//                     </p>
//                   )}
//                   {history.map((item) => (
//                     <Card
//                       key={item.id}
//                       className="p-4 hover:border-indigo-500 transition-all cursor-pointer group"
//                     >
//                       <div className="flex justify-between items-center">
//                         <div
//                           onClick={() => setSelectedVersion(item)}
//                           className="flex-grow"
//                         >
//                           <p className="font-bold text-sm truncate w-32">
//                             {item.content?.contact?.name || "Untitled"}
//                           </p>
//                           <p className="text-[10px] text-slate-400">
//                             {new Date(item.updatedAt).toLocaleString()}
//                           </p>
//                         </div>
//                         <Button
//                           size="sm"
//                           variant="ghost"
//                           className="h-8 w-8 p-0 hover:bg-indigo-50 hover:text-indigo-600"
//                           onClick={() => {
//                             reset(item.content)
//                             toast.success("Version Restored!")
//                           }}
//                         >
//                           <RotateCcw className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               </SheetContent>
//             </Sheet>

//             {isClient && (
//               <PDFDownloadLink
//                 document={<ResumePDF data={resumeData} />}
//                 fileName="resume.pdf"
//               >
//                 {({ loading }) => (
//                   <Button
//                     variant="outline"
//                     className="rounded-xl border-2 font-bold"
//                     disabled={loading}
//                   >
//                     <Download className="h-4 w-4 mr-2" />{" "}
//                     {loading ? "..." : "Export"}
//                   </Button>
//                 )}
//               </PDFDownloadLink>
//             )}

//             <Button
//               onClick={handleSave}
//               disabled={isSaving}
//               className="bg-indigo-600 rounded-xl font-bold px-6 shadow-lg shadow-indigo-100"
//             >
//               {isSaving ? (
//                 <Loader2 className="animate-spin h-4 w-4" />
//               ) : (
//                 <Save className="h-4 w-4 mr-2" />
//               )}{" "}
//               Save
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* VERSION PREVIEW DIALOG (MODAL) */}
//       <Dialog
//         open={!!selectedVersion}
//         onOpenChange={() => setSelectedVersion(null)}
//       >
//         <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Version Preview</DialogTitle>
//           </DialogHeader>
//           <div className="bg-slate-50 p-8 rounded-lg border text-[11px] text-slate-800">
//             <h2 className="text-center text-xl font-bold uppercase border-b pb-2 mb-2">
//               {selectedVersion?.content?.contact?.name}
//             </h2>
//             <div className="flex justify-center gap-3 text-slate-500 mb-6 pb-2 border-b">
//               {/* Changed <Text> to <span> */}
//               <span>• {selectedVersion?.content?.contact?.email}</span>
//               <span>• {selectedVersion?.content?.contact?.phone}</span>
//               <span>• {selectedVersion?.content?.contact?.location}</span>
//               <span>• {selectedVersion?.content?.contact?.github}</span>
//             </div>
//             <div className="space-y-6"> 
//               {selectedVersion?.content?.summary && (
//                 <div>
//                   <h3 className="font-bold border-b text-[9px] text-slate-400 uppercase tracking-widest mb-1">
//                     Summary
//                   </h3>
//                   <p className="leading-relaxed">
//                     {selectedVersion?.content?.summary}
//                   </p>
//                 </div>
//               )}
//               <Section
//                 label="Experience"
//                 data={selectedVersion?.content?.experience}
//                 titleKey="role"
//                 subKey="company"
//               />
//               <Section
//                 label="Projects"
//                 data={selectedVersion?.content?.projects}
//                 titleKey="name"
//                 subKey="link"
//               />
//               <Section
//                 label="Education"
//                 data={selectedVersion?.content?.education}
//                 titleKey="school"
//                 subKey="degree"
//               />
//               {selectedVersion?.content?.skills && (
//                 <div>
//                   <h3 className="font-bold border-b text-[9px] text-slate-400 uppercase tracking-widest mb-1">
//                     Skills
//                   </h3>
//                   <p className="leading-relaxed">
//                     {selectedVersion.content.skills}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <main className="container mx-auto px-6 max-w-7xl mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 pb-20">
//         <div className="lg:col-span-7">
//           <Tabs
//             value={activeTab}
//             onValueChange={setActiveTab}
//             className="space-y-6"
//           >
//             <TabsList className="grid grid-cols-5 h-14 bg-slate-100 p-1 rounded-xl">
//               <TabsTrigger value="contact">
//                 <User className="h-4 w-4" />
//               </TabsTrigger>
//               <TabsTrigger value="experience">
//                 <Briefcase className="h-4 w-4" />
//               </TabsTrigger>
//               <TabsTrigger value="projects">
//                 <FolderGit2 className="h-4 w-4" />
//               </TabsTrigger>
//               <TabsTrigger value="education">
//                 <GraduationCap className="h-4 w-4" />
//               </TabsTrigger>
//               <TabsTrigger value="skills">
//                 <Code2 className="h-4 w-4" />
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="contact" className="space-y-4">
//               <Card className="p-6 border-2 shadow-none rounded-2xl space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-xs font-bold text-slate-500">
//                       Full Name
//                     </label>
//                     <Input
//                       {...register("contact.name")}
//                       placeholder="John Doe"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-xs font-bold text-slate-500">
//                       Email
//                     </label>
//                     <Input
//                       {...register("contact.email")}
//                       placeholder="john@example.com"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-xs font-bold text-slate-500">
//                       Phone
//                     </label>
//                     <Input
//                       {...register("contact.phone")}
//                       placeholder="+1 234 567 890"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-xs font-bold text-slate-500">
//                       Location
//                     </label>
//                     <Input
//                       {...register("contact.location")}
//                       placeholder="New York, NY"
//                     />
//                   </div>
//                   <div className="col-span-2 space-y-2">
//                     <label className="text-xs font-bold text-slate-500">
//                       GitHub URL
//                     </label>
//                     <Input
//                       {...register("contact.github")}
//                       placeholder="github.com/username"
//                     />
//                   </div>
//                 </div>
//                 <div className="relative">
//                   <label className="text-xs font-bold text-slate-500 mb-2 block">
//                     Professional Summary
//                   </label>
//                   <Textarea
//                     {...register("summary")}
//                     placeholder="Professional Summary..."
//                     className="min-h-[120px]"
//                   />
//                   <Button
//                     type="button"
//                     onClick={() => handleAIImprove(null, "summary")}
//                     disabled={isImproving}
//                     className="absolute bottom-2 right-2 h-7 bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
//                   >
//                     <Sparkles className="h-3 w-3 mr-1" /> Enhance Summary
//                   </Button>
//                 </div>
//               </Card>
//             </TabsContent>

//             {/* EXPERIENCE */}
//             <TabsContent value="experience" className="space-y-4">
//               {expFields.map((field, index) => (
//                 <Card
//                   key={field.id}
//                   className="p-6 relative border-2 shadow-none rounded-2xl"
//                 >
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => remExp(index)}
//                     className="absolute top-2 right-2 text-slate-300 hover:text-red-500"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                   <div className="grid grid-cols-2 gap-4 mb-4">
//                     <Input
//                       {...register(`experience.${index}.company`)}
//                       placeholder="Company"
//                     />
//                     <Input
//                       {...register(`experience.${index}.role`)}
//                       placeholder="Role"
//                     />
//                   </div>
//                   <div className="relative">
//                     <Textarea
//                       {...register(`experience.${index}.description`)}
//                       placeholder="Achievements..."
//                     />
//                     <Button
//                       type="button"
//                       onClick={() => handleAIImprove(index, "experience")}
//                       className="absolute bottom-2 right-2 h-7 bg-indigo-50 text-indigo-600"
//                     >
//                       <Sparkles className="h-3 w-3 mr-1" /> Refine
//                     </Button>
//                   </div>
//                 </Card>
//               ))}
//               <Button
//                 onClick={() =>
//                   addExp({ company: "", role: "", description: "" })
//                 }
//                 variant="outline"
//                 className="w-full border-dashed border-2 h-14"
//               >
//                 <Plus className="mr-2 h-4 w-4" /> Add Experience
//               </Button>
//             </TabsContent>

//             {/* PROJECTS */}
//             <TabsContent value="projects" className="space-y-4">
//               {projFields.map((field, index) => (
//                 <Card
//                   key={field.id}
//                   className="p-6 relative border-2 shadow-none rounded-2xl"
//                 >
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => remProj(index)}
//                     className="absolute top-2 right-2 text-slate-300"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                   <div className="grid grid-cols-2 gap-4 mb-4">
//                     <Input
//                       {...register(`projects.${index}.name`)}
//                       placeholder="Project Name"
//                     />
//                     <Input
//                       {...register(`projects.${index}.link`)}
//                       placeholder="Project URL"
//                     />
//                   </div>
//                   <div className="relative">
//                     <Textarea
//                       {...register(`projects.${index}.description`)}
//                       placeholder="Description..."
//                     />
//                     <Button
//                       type="button"
//                       onClick={() => handleAIImprove(index, "project")}
//                       className="absolute bottom-2 right-2 h-7 bg-indigo-50 text-indigo-600"
//                     >
//                       <Sparkles className="h-3 w-3 mr-1" /> Refine Project
//                     </Button>
//                   </div>
//                 </Card>
//               ))}
//               <Button
//                 onClick={() => addProj({ name: "", description: "", link: "" })}
//                 variant="outline"
//                 className="w-full border-dashed border-2 h-14"
//               >
//                 <Plus className="mr-2 h-4 w-4" /> Add Project
//               </Button>
//             </TabsContent>

//             {/* EDUCATION */}
//             <TabsContent value="education" className="space-y-4">
//               {eduFields.map((field, index) => (
//                 <Card
//                   key={field.id}
//                   className="p-6 relative border-2 shadow-none rounded-2xl"
//                 >
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => remEdu(index)}
//                     className="absolute top-2 right-2 text-slate-300"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                   <div className="grid grid-cols-2 gap-4">
//                     <Input
//                       {...register(`education.${index}.school`)}
//                       placeholder="University/School"
//                     />
//                     <Input
//                       {...register(`education.${index}.degree`)}
//                       placeholder="Degree"
//                     />
//                   </div>
//                 </Card>
//               ))}
//               <Button
//                 onClick={() => addEdu({ school: "", degree: "", year: "" })}
//                 variant="outline"
//                 className="w-full border-dashed border-2 h-14"
//               >
//                 <Plus className="mr-2 h-4 w-4" /> Add Education
//               </Button>
//             </TabsContent>

//             <TabsContent value="skills">
//               <Card className="p-6 border-2 shadow-none rounded-2xl">
//                 <Textarea
//                   {...register("skills")}
//                   placeholder="React, Next.js..."
//                   className="min-h-[150px]"
//                 />
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>

//         {/* PREVIEW SIDE */}
//         <div className="lg:col-span-5 hidden lg:block sticky top-32 h-[calc(100vh-160px)]">
//           <div className="bg-slate-900 rounded-[2.5rem] p-4 h-full shadow-2xl overflow-hidden flex flex-col">
//             <div className="bg-white rounded-2xl p-8 overflow-y-auto text-[10px] text-slate-800 flex-grow shadow-inner">
//               <h2 className="text-lg font-black text-center border-b pb-2 mb-1 tracking-tighter uppercase">
//                 {resumeData.contact?.name || "YOUR NAME"}
//               </h2>
//               <div className="flex flex-wrap gap-x-4 gap-y-2 text-slate-900 font-medium mb-6 mt-2 justify-center">
//                 {resumeData.contact?.email && (
//                   <span className="flex items-center gap-1.5">
//                     <Mail className="h-3 w-3 text-indigo-600" />
//                     {resumeData.contact.email}
//                   </span>
//                 )}
//                 {resumeData.contact?.location && (
//                   <span className="flex items-center gap-1.5">
//                     <MapPin className="h-3 w-3 text-indigo-600" />
//                     {resumeData.contact.location}
//                   </span>
//                 )}
//                 {resumeData.contact?.phone && (
//                   <span className="flex items-center gap-1.5">
//                     <Phone className="h-3 w-3 text-indigo-600" />
//                     {resumeData.contact.phone}
//                   </span>
//                 )}
//                 {resumeData.contact?.github && (
//                   <span className="flex items-center gap-1.5">
//                     <Github className="h-3 w-3 text-indigo-600" />
//                     {resumeData.contact.github.replace("https://", "")}
//                   </span>
//                 )}
//               </div>
//               <div className="space-y-6">
//                 {resumeData.summary && (
//                   <div>
//                     <h3 className="font-bold uppercase text-slate-400 border-b mb-1 text-[8px] tracking-widest">
//                       Summary
//                     </h3>
//                     <p className="leading-relaxed">{resumeData.summary}</p>
//                   </div>
//                 )}
//                 <Section
//                   label="Experience"
//                   data={resumeData.experience}
//                   titleKey="role"
//                   subKey="company"
//                 />
//                 <Section
//                   label="Projects"
//                   data={resumeData.projects}
//                   titleKey="name"
//                   subKey="link"
//                 />
//                 <Section
//                   label="Education"
//                   data={resumeData.education}
//                   titleKey="school"
//                   subKey="degree"
//                 />
//                 {resumeData.skills && (
//                   <div>
//                     <h3 className="font-bold uppercase text-slate-400 border-b mb-1 text-[8px] tracking-widest">
//                       Skills
//                     </h3>
//                     <p>{resumeData.skills}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

// function Section({ label, data, titleKey, subKey }) {
//   const filtered = data?.filter((item) => item[titleKey])
//   if (!filtered?.length) return null
//   return (
//     <div>
//       <h3 className="font-bold uppercase text-slate-400 border-b mb-2 text-[8px] tracking-widest">
//         {label}
//       </h3>
//       {filtered.map((item, i) => (
//         <div key={i} className="mb-3">
//           <p className="font-bold text-slate-900">{item[titleKey]}</p>
//           <p className="text-slate-500 italic mb-1">{item[subKey]}</p>
//           <p className="leading-tight text-slate-600">{item.description}</p>
//         </div>
//       ))}
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  User,
  Briefcase,
  GraduationCap,
  Code2,
  FolderGit2,
  Trash2,
  Sparkles,
  Save,
  Download,
  Loader2,
  Plus,
  History,
  RotateCcw,
} from "lucide-react"
import { improveWithAI, saveResume, getResumeHistoryy } from "@/actions/resume"
import { toast } from "sonner"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { ResumePDF } from "@/components/ResumePDF/ResumePDF"

export default function ResumeBuilderPage({ initialData }) {
  const [activeTab, setActiveTab] = useState("contact")
  const [isImproving, setIsImproving] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [history, setHistory] = useState([])
  const [selectedVersion, setSelectedVersion] = useState(null)

  const fetchHistory = async () => {
    const res = await getResumeHistoryy()
    if (res.success) setHistory(res.data)
    else toast.error("Could not load history")
  }

  useEffect(() => setIsClient(true), [])

  const { register, control, watch, setValue, reset } = useForm({
    defaultValues: initialData || {
      contact: { name: "", profession: "",email: "", phone: "", location: "", github: "" },
      summary: "",
      experience: [{ company: "", role: "", description: "" }],
      education: [{ school: "", degree: "", year: "" }],
      projects: [{ name: "", description: "", link: "" }],
      skills: "",
    },
  })

  const resumeData = watch()

  const { fields: expFields, append: addExp, remove: remExp } = useFieldArray({ control, name: "experience" })
  const { fields: eduFields, append: addEdu, remove: remEdu } = useFieldArray({ control, name: "education" })
  const { fields: projFields, append: addProj, remove: remProj } = useFieldArray({ control, name: "projects" })

  const handleSave = async () => {
    setIsSaving(true)
    const res = await saveResume(resumeData)
    res.success ? toast.success("Saved to Database!") : toast.error("Save failed")
    setIsSaving(false)
  }

  const handleAIImprove = async (index, type) => {
    let currentText = ""
    if (type === "experience") currentText = watch(`experience.${index}.description`)
    else if (type === "project") currentText = watch(`projects.${index}.description`)
    else if (type === "summary") currentText = watch("summary")

    if (!currentText) return toast.error("Please enter some text first")

    setIsImproving(true)
    try {
      const improved = await improveWithAI({ current: currentText, type })
      if (type === "experience") setValue(`experience.${index}.description`, improved)
      else if (type === "project") setValue(`projects.${index}.description`, improved)
      else if (type === "summary") setValue("summary", improved)
      toast.success("AI Enhancement Applied!")
    } catch (error) {
      toast.error("AI enhancement failed")
    } finally {
      setIsImproving(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER SECTION */}
      <header className="bg-slate-50 border-b py-6 sticky top-0 z-50">
        <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tighter text-slate-900">
            RESUME<span className="text-indigo-600">ARCHITECT</span>
          </h1>
          <div className="flex gap-3">
            <Sheet onOpenChange={(open) => open && fetchHistory()}>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-xl border-2 font-bold">
                  <History className="h-4 w-4 mr-2" /> History
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader><SheetTitle>Resume Archives</SheetTitle></SheetHeader>
                <div className="mt-6 space-y-4">
                  {history.length === 0 && <p className="text-slate-400 text-sm text-center">No saved versions found.</p>}
                  {history.map((item) => (
                    <Card key={item.id} className="p-4 hover:border-indigo-500 transition-all cursor-pointer group">
                      <div className="flex justify-between items-center">
                        <div onClick={() => setSelectedVersion(item)} className="flex-grow">
                          <p className="font-bold text-sm truncate w-32">{item.content?.contact?.name || "Untitled"}</p>
                          <p className="text-[10px] text-slate-400">{new Date(item.updatedAt).toLocaleString()}</p>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => { reset(item.content); toast.success("Version Restored!"); }}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {isClient && (
              <PDFDownloadLink document={<ResumePDF data={resumeData} />} fileName="resume.pdf">
                {({ loading }) => (
                  <Button variant="outline" className="rounded-xl border-2 font-bold" disabled={loading}>
                    <Download className="h-4 w-4 mr-2" /> {loading ? "..." : "Export"}
                  </Button>
                )}
              </PDFDownloadLink>
            )}

            <Button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 rounded-xl font-bold px-6 shadow-lg shadow-indigo-100">
              {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4 mr-2" />} Save
            </Button>
          </div>
        </div>
      </header>

      {/* VERSION PREVIEW DIALOG */}
      <Dialog open={!!selectedVersion} onOpenChange={() => setSelectedVersion(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-none">
          <div className="p-4 bg-slate-900 text-white rounded-t-lg">
            <DialogHeader><DialogTitle className="text-white">Version Preview</DialogTitle></DialogHeader>
          </div>
          {selectedVersion && <TwoColumnPreview data={selectedVersion.content} isModal={true} />}
        </DialogContent>
      </Dialog>

      <main className="container mx-auto px-6 max-w-7xl mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 pb-20">
        {/* INPUT TABS */}
        <div className="lg:col-span-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-5 h-14 bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="contact"><User className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="experience"><Briefcase className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="projects"><FolderGit2 className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="education"><GraduationCap className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="skills"><Code2 className="h-4 w-4" /></TabsTrigger>
            </TabsList>

            <TabsContent value="contact" className="space-y-4">
              <Card className="p-6 border-2 shadow-none rounded-2xl space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500">Full Name</label><Input {...register("contact.name")} placeholder="John Doe" /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500">Profession</label><Input {...register("contact.profession")} placeholder="Enter Your Profession" /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500">Email</label><Input {...register("contact.email")} placeholder="john@example.com" /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500">Phone</label><Input {...register("contact.phone")} placeholder="+1 234 567 890" /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500">Location</label><Input {...register("contact.location")} placeholder="New York, NY" /></div>
                  <div className="col-span-2 space-y-2"><label className="text-xs font-bold text-slate-500">GitHub URL</label><Input {...register("contact.github")} placeholder="github.com/username" /></div>
                </div>
                <div className="relative">
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Professional Summary</label>
                  <Textarea {...register("summary")} placeholder="Professional Summary..." className="min-h-[120px]" />
                  <Button type="button" onClick={() => handleAIImprove(null, "summary")} disabled={isImproving} className="absolute bottom-2 right-2 h-7 bg-indigo-50 text-indigo-600 hover:bg-indigo-100">
                    <Sparkles className="h-3 w-3 mr-1" /> Enhance Summary
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-4">
              {expFields.map((field, index) => (
                <Card key={field.id} className="p-6 relative border-2 shadow-none rounded-2xl">
                  <Button variant="ghost" size="sm" onClick={() => remExp(index)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input {...register(`experience.${index}.company`)} placeholder="Company" />
                    <Input {...register(`experience.${index}.role`)} placeholder="Role" />
                  </div>
                  <div className="relative">
                    <Textarea {...register(`experience.${index}.description`)} placeholder="Achievements..." />
                    <Button type="button" onClick={() => handleAIImprove(index, "experience")} className="absolute bottom-2 right-2 h-7 bg-indigo-50 text-indigo-600">
                      <Sparkles className="h-3 w-3 mr-1" /> Refine
                    </Button>
                  </div>
                </Card>
              ))}
              <Button onClick={() => addExp({ company: "", role: "", description: "" })} variant="outline" className="w-full border-dashed border-2 h-14">
                <Plus className="mr-2 h-4 w-4" /> Add Experience
              </Button>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              {projFields.map((field, index) => (
                <Card key={field.id} className="p-6 relative border-2 shadow-none rounded-2xl">
                  <Button variant="ghost" size="sm" onClick={() => remProj(index)} className="absolute top-2 right-2 text-slate-300"><Trash2 className="h-4 w-4" /></Button>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input {...register(`projects.${index}.name`)} placeholder="Project Name" />
                    <Input {...register(`projects.${index}.link`)} placeholder="Project URL" />
                  </div>
                  <div className="relative">
                    <Textarea {...register(`projects.${index}.description`)} placeholder="Description..." />
                    <Button type="button" onClick={() => handleAIImprove(index, "project")} className="absolute bottom-2 right-2 h-7 bg-indigo-50 text-indigo-600">
                      <Sparkles className="h-3 w-3 mr-1" /> Refine Project
                    </Button>
                  </div>
                </Card>
              ))}
              <Button onClick={() => addProj({ name: "", description: "", link: "" })} variant="outline" className="w-full border-dashed border-2 h-14">
                <Plus className="mr-2 h-4 w-4" /> Add Project
              </Button>
            </TabsContent>

            <TabsContent value="education" className="space-y-4">
              {eduFields.map((field, index) => (
                <Card key={field.id} className="p-6 relative border-2 shadow-none rounded-2xl">
                  <Button variant="ghost" size="sm" onClick={() => remEdu(index)} className="absolute top-2 right-2 text-slate-300"><Trash2 className="h-4 w-4" /></Button>
                  <div className="grid grid-cols-2 gap-4">
                    <Input {...register(`education.${index}.school`)} placeholder="University/School" />
                    <Input {...register(`education.${index}.degree`)} placeholder="Degree" />
                    <Input {...register(`education.${index}.percentage`)} placeholder="Percentage/CGPA" />
                  </div>
                </Card>
              ))}
              <Button onClick={() => addEdu({ school: "", degree: "", year: "" })} variant="outline" className="w-full border-dashed border-2 h-14">
                <Plus className="mr-2 h-4 w-4" /> Add Education
              </Button>
            </TabsContent>

            <TabsContent value="skills">
              <Card className="p-6 border-2 shadow-none rounded-2xl">
                <Textarea {...register("skills")} placeholder="React, Next.js..." className="min-h-[150px]" />
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* TWO-COLUMN PREVIEW SIDE */}
        <div className="lg:col-span-6 hidden lg:block sticky top-32 h-[calc(100vh-160px)]">
          <TwoColumnPreview data={resumeData} />
        </div>
      </main>
    </div>
  )
}

// SHARED TWO-COLUMN COMPONENT
function TwoColumnPreview({ data, isModal = false }) {
  return (
    <div className={`bg-slate-900 ${isModal ? "" : "rounded-[2.5rem] p-4 shadow-2xl"} h-full overflow-hidden flex flex-col`}>
      <div className={`bg-white ${isModal ? "" : "rounded-2xl"} h-full overflow-hidden flex shadow-inner`}>
        
        {/* Sidebar (Left) */}
        <div className="w-1/3 bg-slate-50 p-6 border-r flex flex-col gap-6 overflow-y-auto">
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase leading-tight tracking-tighter">
              {data.contact?.name || "YOUR NAME"}
            </h2>
            <p className="text-[8px] font-bold text-indigo-600 uppercase tracking-wider mt-1">
              {data.contact?.profession || "Profession"}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-[7px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Contact</h3>
            <div className="space-y-1 text-[8px] text-slate-600">
              {data.contact?.email && <p className="truncate font-medium">{data.contact.email}</p>}
              {data.contact?.phone && <p>{data.contact.phone}</p>}
              {data.contact?.location && <p className="italic">{data.contact.location}</p>}
              {data.contact?.github && <p className="truncate text-indigo-600">{data.contact.github}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[7px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Education</h3>
            {data.education?.filter(e => e.school).map((edu, i) => (
              <div key={i} className="space-y-0.5">
                <p className="text-[8px] font-bold text-slate-800 leading-tight">{edu.school}</p>
                <p className="text-[7px] text-slate-500">{edu.degree} - <span className="text-blue-600 font-medium">{edu.percentage}</span></p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-[7px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Skills</h3>
            <p className="text-[8px] text-slate-600 leading-relaxed whitespace-pre-line">
              {data.skills}
            </p>
          </div>
        </div>

        {/* Main Content (Right) */}
        <div className="w-2/3 p-8 overflow-y-auto bg-white flex flex-col gap-6">
          <section>
            <h3 className="text-[7px] font-black text-slate-400 uppercase tracking-widest border-b pb-1 mb-2">Summary</h3>
            <p className="text-[9px] text-slate-700 leading-relaxed">{data.summary}</p>
          </section>

          <section>
            <h3 className="text-[7px] font-black text-slate-400 uppercase tracking-widest border-b pb-1 mb-3">Professional Experience</h3>
            {data.experience?.filter(e => e.role).map((exp, i) => (
              <div key={i} className="mb-4">
                <p className="text-[9px] font-bold text-slate-900">{exp.role}</p>
                <p className="text-[8px] text-slate-500 italic mb-1">{exp.company}</p>
                <p className="text-[8px] text-slate-600 leading-tight">{exp.description}</p>
              </div>
            ))}
          </section>

          <section>
            <h3 className="text-[7px] font-black text-slate-400 uppercase tracking-widest border-b pb-1 mb-3">Key Projects</h3>
            {data.projects?.filter(p => p.name).map((proj, i) => (
              <div key={i} className="mb-4">
                <p className="text-[9px] font-bold text-slate-900">{proj.name}</p>
                <p className="text-[8px] text-indigo-600 truncate mb-1">{proj.link}</p>
                <p className="text-[8px] text-slate-600 leading-tight">{proj.description}</p>
              </div>
            ))}
          </section>
        </div>

      </div>
    </div>
  );
}