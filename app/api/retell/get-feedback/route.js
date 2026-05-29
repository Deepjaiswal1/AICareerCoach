// import { NextResponse } from "next/server";

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const callId = searchParams.get("callId");

//   if (!callId) {
//     return NextResponse.json({ error: "Call ID is required" }, { status: 400 });
//   }

//   try {
//     const response = await fetch(`https://api.retellai.com/v2/get-call/${callId}`, {
//       headers: {
//         "Authorization": `Bearer ${process.env.RETELL_API_KEY}`,
//       },
//     });

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("Retell Fetch Error:", error);
//     return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/prisma"; // Adjust this path to your Prisma client location

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const callId = searchParams.get("callId");
  const interviewId = searchParams.get("interviewId");

  if (!callId || !interviewId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    // 1. Fetch the raw transcript from Retell
    const retellResponse = await fetch(`https://api.retellai.com/v2/get-call/${callId}`, {
      headers: { "Authorization": `Bearer ${process.env.RETELL_API_KEY}` },
    });
    
    if (!retellResponse.ok) throw new Error("Failed to fetch from Retell");
    const callData = await retellResponse.json();
    const conversation = callData.transcript || "No transcript available.";

    // 2. Initialize Gemini and your specific Prompt
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const FEEDBACK_PROMPT = `
      Conversation: ${conversation}
      
      Based on this interview between an AI assistant and a user, provide:
      1. Ratings (1-10) for: Technical Skills, Communication, Problem Solving, and Experience.
      2. A 3-line summary of their performance.
      3. A hire recommendation (Yes/No) and a short message.

      Return ONLY a JSON object in this format:
      {
        "feedback": {
          "rating": {
            "technicalSkills": 0,
            "communication": 0,
            "problemSolving": 0,
            "experience": 0
          },
          "summary": "",
          "Recommendation": "",
          "RecommendationMsg": ""
        }
      }
    `;

    // 3. Generate Feedback via Gemini
    const result = await model.generateContent(FEEDBACK_PROMPT);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const feedbackObject = JSON.parse(cleanJson);

    // 4. PRISMA DATABASE SAVE
    // We update the existing record where the ID matches
    const updatedRecord = await db.mockInterview.update({
      where: {
        id: interviewId, // This is the ID from your DB, passed from frontend
      },
      data: {
        feedback: feedbackObject, // Storing the structured JSON from Gemini
        status: "completed",       // Updating status so you know it's finished
      },
    });

    console.log("✅ Prisma: Feedback saved for Interview ID:", interviewId);

    // Return the updated data to the frontend for the console.log
    return NextResponse.json(updatedRecord.feedback);

  } catch (error) {
    console.error("❌ Feedback Save Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}