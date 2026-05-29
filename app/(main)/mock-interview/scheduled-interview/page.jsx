"use client"
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import InterviewCardItem from '../_components/InterviewCardItem'
import { Loader2 } from 'lucide-react'

const ScheduledInterviews = () => {
  const { user } = useUser();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchInterviews();
  }, [user]);

  const fetchInterviews = async () => {
    // We fetch using the Clerk ID, which our API converts to the internal ID
    const res = await fetch(`/api/user-interviews?clerkId=${user.id}`);
    const data = await res.json();
    setInterviews(data);
    setLoading(false);
  }

  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl text-black'>Scheduled Interviews</h2>
      <p className='text-gray-900'>Review your performance and AI feedback</p>

      {loading ? (
        <Loader2 className='animate-spin h-10 w-10 mt-10' />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8'>
          {interviews.map((item) => (
            <InterviewCardItem key={item.id} interview={item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ScheduledInterviews;