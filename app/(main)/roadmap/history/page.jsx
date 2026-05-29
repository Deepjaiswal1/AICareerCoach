"use client"

import { useEffect, useState } from "react"
import { getUserRoadmaps } from "@/actions/roadmap"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Calendar, Map, ArrowRight, History, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function RoadmapHistoryPage() {
  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      const result = await getUserRoadmaps()
      if (result.success) setRoadmaps(result.data)
      setLoading(false)
    }
    fetchHistory()
  }, [])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <Link href={`/roadmap`}>
        <Button variant={`link`}><ArrowLeft/>Back</Button>
      </Link>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <History className="text-indigo-900" /> Learning Vault
          </h1>
          <p className="text-slate-900 mt-1">
            Review and resume your generated career architectures
          </p>
        </div>
        <Link href="/roadmap">
          <Button className="bg-black text-white hover:bg-slate-800 rounded-xl">
            Generate New
          </Button>
        </Link>
      </div>

      {roadmaps.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <Map className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900">
            No Roadmaps Found
          </h3>
          <p className="text-slate-500">
            Your generated career paths will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((roadmap) => (
            <Card
              key={roadmap.id}
              className="group hover:shadow-xl transition-all duration-300 border-slate-200 overflow-hidden rounded-2xl"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Map className="h-4 w-4" />
                  </div>
                  <div className="flex items-center text-[10px] font-medium text-slate-400 gap-1 uppercase tracking-tighter">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(roadmap.createdAt), "MMM dd, yyyy")}
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">
                  {roadmap.jobTitle}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                  {roadmap.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {roadmap.duration || "Self-Paced"}
                  </span>
                  <Link href={`/roadmap/${roadmap.id}`}>
                    <Button
                      variant="ghost"
                      className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-2 font-bold text-xs uppercase tracking-tighter"
                    >
                      View Flow <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
