"use client"
import { Button } from "@/components/ui/button"
import { Video, Loader2, Plus } from "lucide-react"
import React, { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import InterviewCardItem from "../_components/InterviewCardItem"
import Link from "next/link"

const AllInterviews = () => {
  const { user } = useUser()
  const [interviewList, setInterviewList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.id) {
      console.log("Main User ID from Auth:", user.id) // Check if this matches cbfdf1de...
      GetInterviewList()
    }
  }, [user])

  const GetInterviewList = async () => {
    setLoading(true)
    try {
      // user.id from Clerk is the 'clerkId' our API now expects
      const response = await fetch(`/api/user-interviews?clerkId=${user?.id}`)
      const result = await response.json()
      setInterviewList(result)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="my-5">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-bold text-2xl text-gray-800">Your Interview</h2>
        </div>
        <Link href="/mock-interview/dashboard/create-interview">
          <Button className="bg-blue-600 hover:bg-blue-700 flex gap-2">
            <Plus className="h-4 w-4" /> New Interview
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center mt-12">
          <Loader2 className="animate-spin h-10 w-10 text-blue-900" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {interviewList?.length > 0 ? (
            interviewList.map((interview) => (
              <InterviewCardItem key={interview.id} interview={interview} />
            ))
          ) : (
            <div className="p-12 flex flex-col gap-4 items-center bg-gray-50 mt-5 rounded-3xl border-2 border-dashed border-gray-200 col-span-full text-center">
              <Video className="h-12 w-12 text-gray-300" />
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-gray-700">
                  No interviews recorded yet
                </h2>
                <p className="text-gray-500">
                  Your sessions will appear here once you complete them.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AllInterviews
