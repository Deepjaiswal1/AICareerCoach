import React from 'react';
import { CheckCircle2, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function InterviewCompleted() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Success Header */}
        <div className="flex flex-col items-center pt-12 pb-6">
          <div className="bg-green-500 rounded-full p-2 mb-4">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Interview Complete!
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            Thank you for participating in the AI-driven interview.
          </p>
        </div>

        {/* Hero Illustration */}
        <div className="px-10 py-5">
          <div className="relative h-[250px] w-full bg-orange-50 rounded-2xl flex items-center justify-center overflow-hidden border border-orange-100">
             {/* Replace with your specific SVG or image asset */}
             <Image 
                src="/interview.png" 
                alt="Interview Complete" 
                fill 
                className="object-contain p-8"
             />
          </div>
        </div>

        {/* What's Next Section */}
        <div className="bg-white px-10 pb-12 pt-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 rounded-full p-3 shadow-md shadow-blue-200">
              <Send className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">What's Next?</h2>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            The recruiter will review your interview responses and will contact you soon regarding the next steps.
          </p>
          
          <div className="mt-10">
            <Link 
              href="/mock-interview/dashboard" 
              className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-all shadow-lg inline-block"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}