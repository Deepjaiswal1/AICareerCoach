
import { Video } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CreateOptions = () => {
  return (
    // Outer container: full width, gradient background, and centered content
    <div className='w-full min-h-[300px] bg-gradient-to-r from-indigo-500 to-purple-600 p-10 flex flex-col items-center justify-center'>
      
      {/* Optional: Dashboard Heading if you want it inside this section */}
      {/* <div className="w-full max-w-7xl mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      </div> */}

      <div className='w-full flex justify-center'>
        <Link 
          href={'/mock-interview/dashboard/create-interview'} 
          className='bg-white border border-gray-200 rounded-xl p-10 flex flex-col items-center text-center gap-4 cursor-pointer hover:scale-105 transition-all shadow-xl w-full max-w-md'
        >
          <div className='bg-blue-50 p-4 rounded-xl'>
            <Video className='text-blue-900 h-10 w-10'/>
          </div>
          
          <div>
            <h2 className='font-bold text-2xl text-gray-800'>Create New Interview</h2>
            <p className='text-gray-500 text-base mt-2'>
              Create AI Interviews and Schedule them with Candidates
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default CreateOptions