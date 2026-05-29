"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Copy, Send, Check } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

const InterviewCardItem = ({ interview }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  
  // Detects if we are on the scheduled-interview history page
  const isScheduledPage = pathname.includes('scheduled-interview');

  const interviewLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/mockinterview/${interview?.id}` 
    : '';

  const onCopy = () => {
    navigator.clipboard.writeText(interviewLink).then(() => {
      setCopied(true);
      toast('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const onSend = async () => {
    const shareData = {
      title: `${interview?.jobPosition} Interview`,
      url: interviewLink,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else window.open(`mailto:?subject=${shareData.title}&body=${interviewLink}`);
    } catch (err) { console.error(err); }
  }

 const onViewReport = () => {
  // Path must start with /mock-interview based on your folder structure
  router.push(`/mock-interview/scheduled-interview/${interview?.id}/details`);
}

  return (
    <div className='border shadow-sm rounded-xl p-5 bg-white hover:shadow-md transition-all'>
      <div className='flex justify-between items-start'>
        <div>
          <h2 className='font-bold text-blue-600 text-lg'>{interview?.jobPosition}</h2>
          <p className='text-sm text-gray-500 font-medium'>{interview?.duration} Session</p>
        </div>
        <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
          interview?.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {interview?.status?.toUpperCase() || 'COMPLETED'}
        </span>
      </div>

      <p className='text-xs text-gray-400 mt-2'>
        Date: {new Date(interview.createdAt).toLocaleDateString()}
      </p>
      
      <div className='mt-5'>
        {isScheduledPage ? (
          /* Button for History Page: Full Redirect */
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 flex gap-2" 
            onClick={onViewReport}
          >
            <FileText className='h-4 w-4' /> View Detailed Report
          </Button>
        ) : (
          /* Buttons for Dashboard/Home Page: Copy & Share */
          <div className='flex gap-2'>
            <Button variant="outline" className="flex-1 text-xs gap-2" onClick={onCopy}>
              {copied ? <Check className='h-3 w-3 text-green-600'/> : <Copy className='h-3 w-3'/>}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button className="flex-1 text-xs gap-2 bg-blue-500 hover:bg-blue-600 text-white" onClick={onSend}>
              <Send className='h-3 w-3'/> Send
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default InterviewCardItem;