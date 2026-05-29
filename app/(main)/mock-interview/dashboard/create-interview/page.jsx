"use client"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import FormContainer from "./_components/FormContainer"
import QuestionList from "./_components/QuestionList"
import { toast } from "sonner"
import InterviewLink from "./_components/InterviewLink"

const CreateInterview = () => {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState()
  const [interviewId, setInterviewId] = useState()
  
  const onHandleInputChange = (field, value) => {
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [field]: value,
      };
      console.log("Updated formData:", updatedData); // Logs the fresh value
      return updatedData;
    });
  };

  const onGoToNext = () => {
    if (
      !formData?.jobPosition ||
      !formData?.jobDescription ||
      !formData?.duration ||
      !formData?.type
    ) {
      toast("Please enter all details!")
      return
    }
    setStep(step + 1)
  }

  const onCreateLink = (generatedId) => {
    setInterviewId(generatedId)
    setStep(step + 1)
  }

  const onRestart = () => {
    setFormData(null);
    setInterviewId(null);
    setStep(1);
    toast.info("Started a new session");
  }

  return (
    <div className="px-10 md:px-24 lg:px-44 xl:px-56">
      <div className="flex gap-3 items-center">
        <ArrowLeft onClick={() => router.back()} className="cursor-pointer" />
        <h2 className="font-bold text-2xl">Create New Interview</h2>
      </div>
      <Progress value={step * 33.33} className={`my-5`} />
      {step == 1 ? (
        <FormContainer
          onHandleInputChange={onHandleInputChange}
          GoToNext={() => onGoToNext()}
        />
      ) : step == 2 ? (
        <QuestionList
          formData={formData}
          onCreateLink={(generatedId) => onCreateLink(generatedId)}
        />
      ) : step == 3 ? (
        <InterviewLink generatedId={interviewId} formData={formData} onRestart={onRestart}/>
      ) : null}
    </div>
  )
}

export default CreateInterview
