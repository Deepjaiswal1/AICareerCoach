
// app/api/retell/start-call/route.js

import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // Adjust this path to your Prisma client location

export async function POST(req) {
  try {
    const { agentId, userName, userEmail, jobPosition, questions, interviewId } = await req.json();

    // Format the questions into a single string for the AI
    const questionListString = Array.isArray(questions)
      ? questions.map((q, i) => `Q${i + 1}: ${q.question}`).join(" | ")
      : "No questions provided.";

    // 1. Log what we are sending to Retell
    console.log("---------- SENDING TO RETELL ----------");
    console.log(`Interview ID: ${interviewId}`);
    console.log(`Candidate: ${userName} (${userEmail})`);
    console.log("---------------------------------------");

    const response = await fetch("https://api.retellai.com/v2/create-web-call", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RETELL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id: agentId,
        retell_llm_dynamic_variables: {
          userName: userName,
          userEmail: userEmail,
          jobPosition: jobPosition,
          questionList: questionListString
        }
      }),
    });

    const data = await response.json();

    // 2. CONSOLE THE RESPONSE: This allows you to "solve" and debug the data
    console.log(">>>> RETELL API RESPONSE:", JSON.stringify(data, null, 2));

    // 3. Update Prisma Database
    if (data.call_id && interviewId) {
      try {
        await db.mockInterview.update({
          where: { id: interviewId },
          data: {
            candidateName: userName,
            candidateEmail: userEmail,
            callId: data.call_id, // Saving the Call ID for later feedback
            status: "started",
          },
        });
        console.log("✅ Prisma: MockInterview updated successfully.");
      } catch (dbError) {
        console.error("❌ Prisma Error:", dbError.message);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ API Route Error:", error);
    return NextResponse.json({ error: "Failed to initialize interview" }, { status: 500 });
  }
}