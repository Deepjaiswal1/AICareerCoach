"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  List,
  Mail,
  MessageCircle,
  Plus,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import { toast } from "sonner"

// FIX: Added curly braces to destructure props
const InterviewLink = ({ generatedId, formData }) => {
  
  // Use window.location.origin if host URL isn't set to avoid undefined errors
  const baseUrl = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:3000");
  const url = `${baseUrl}/mockinterview/${generatedId}`;

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Link Copied to Clipboard!")
    } catch (err) {
      toast.error("Failed to copy link")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center mt-10 animate-in fade-in zoom-in duration-500">
      <Image
        src={`/check.png`}
        alt="check"
        width={200}
        height={200}
        className="w-20 h-20"
      />
      <h2 className="font-bold text-2xl mt-4">Your AI Interview is Ready!</h2>
      <p className="mt-3 text-gray-800">
        Share this link with your candidates to start the interview process
      </p>

      <div className="w-full p-7 mt-6 rounded-lg bg-white border border-gray-100 shadow-sm flex flex-col">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-gray-800">Interview Link</h2>
          <h2 className="p-1 px-3 text-xs font-semibold text-blue-700 rounded-full border border-blue-200 bg-blue-50">
            Valid for 30 Days
          </h2>
        </div>
        
        <div className="mt-4 flex gap-3 items-center">
          {/* DefaultValue now uses the clean string URL */}
          <Input value={url} readOnly className="bg-gray-50 border-gray-200" />
          <Button
            className="bg-blue-600 hover:bg-blue-700 font-bold"
            onClick={onCopyLink}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
        </div>

        <hr className="my-6 border-gray-100" />

        <div className="flex gap-6">
          <h2 className="text-sm text-gray-500 flex gap-2 items-center font-medium">
            <Clock className="h-4 w-4 text-blue-500" /> 
            {formData?.duration || "20 Min"}
          </h2>
          <h2 className="text-sm text-gray-500 flex gap-2 items-center font-medium">
            <List className="h-4 w-4 text-blue-500" />
            {formData?.questions?.length || 10} Questions
          </h2>
        </div>
      </div>

      {/* <div className="mt-7 bg-white p-6 rounded-lg w-full border border-gray-100 shadow-sm">
        <h2 className="font-semibold text-gray-700 mb-4">Share Via</h2>
        <div className="flex gap-4 justify-between">
          <Button variant="outline" className="flex-1 gap-2">
            <Mail className="h-4 w-4" /> Email
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <MessageCircle className="h-4 w-4" /> Slack
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
             <span className="text-green-600 font-bold">W</span> Whatsapp
          </Button>
        </div>
      </div> */}

      <div className="flex w-full gap-5 justify-between mt-10">
        <Link href={"/mock-interview/dashboard"}>
          <Button variant="outline" className="text-gray-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* <Link href="/mock-interview/dashboard/create-interview">
  <Button className="bg-blue-600 flex gap-2">
    <Plus className="h-4 w-4" /> New Interview
  </Button>
</Link> */}
      </div>
    </div>
  )
}

export default InterviewLink