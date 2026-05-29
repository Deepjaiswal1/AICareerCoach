// import { db } from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function GET(req, { params }) {
//   try {
//     const { interviewId } = await params;
//     const { searchParams } = new URL(req.url);
//     const clerkId = searchParams.get("clerkId");

//     if (!clerkId) {
//       return NextResponse.json({ error: "No Clerk ID provided" }, { status: 400 });
//     }

//     const interview = await db.mockInterview.findUnique({
//       where: { id: interviewId },
//       include: {
//         // This is the "Join" that brings in "Deepak" instead of "Unknown"
//         user: true 
//       },
//     });

//     if (!interview) {
//       return NextResponse.json({ error: "Interview not found" }, { status: 404 });
//     }

//     // Standardize the JSON fields so the frontend doesn't get 'null'
//     const feedbackData = typeof interview.feedback === "string" 
//       ? JSON.parse(interview.feedback) 
//       : (interview.feedback || {});

//     const questionsData = typeof interview.questions === "string" 
//       ? JSON.parse(interview.questions) 
//       : (interview.questions || []);

//     return NextResponse.json({
//       ...interview,
//       feedback: feedbackData,
//       questions: questionsData,
//     });
//   } catch (error) {
//     console.error("API Route Error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { interviewId } = await params;
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");

    // 1. Log the incoming request details
    console.log("--- API REQUEST START ---");
    console.log("Interview ID:", interviewId);
    console.log("Clerk ID from Query:", clerkId);

    const interview = await db.mockInterview.findUnique({
      where: { id: interviewId },
      include: { 
        user: {
          select: {
            clerkUserId: true,
            name: true,
            imageUrl: true,
          }
        } 
      }
    });

    // 2. Log raw data from Database
    if (!interview) {
      console.warn("⚠️ [DB] No interview found for ID:", interviewId);
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }
    console.log("✅ [DB] Raw Interview Data Fetched:", JSON.stringify(interview, null, 2));

    if (interview.user.clerkUserId !== clerkId) {
      console.error("❌ [AUTH] Clerk ID mismatch! DB User:", interview.user.clerkUserId, "Requested:", clerkId);
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    // Helper to handle JSON parsing
    const safeParse = (data) => {
      if (!data) return null;
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch (e) {
          return data;
        }
      }
      return data;
    };

    const parsedQuestions = safeParse(interview.questions) || [];
    const parsedFeedback = safeParse(interview.feedback) || {};

    // 3. Log the Final Parsed Data being sent to Frontend
    const responseBody = {
      ...interview,
      questions: parsedQuestions,
      feedback: parsedFeedback,
      candidateName: interview.candidateName || interview.user.name || "Candidate"
    };

    console.log("🚀 [API] Sending Parsed Data to Frontend...");
    console.log("Feedback Check:", responseBody.feedback);
    console.log("Questions Count:", parsedQuestions.length);
    console.log("--- API REQUEST END ---");

    return NextResponse.json(responseBody);

  } catch (error) {
    console.error("🔥 [API ERROR]:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message }, 
      { status: 500 }
    );
  }
}