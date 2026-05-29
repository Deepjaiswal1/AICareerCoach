
"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const serializeData = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Fetches interview details and ensures JSON fields are parsed correctly.
 */
export async function getInterviewDetailsById(interviewId) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const interview = await db.mockInterview.findUnique({
      where: { id: interviewId },
      include: {
        user: {
          select: {
            name: true,
            imageUrl: true,
          }
        }
      }
    });

    if (!interview) return { success: false, error: "Interview not found" };;

    // Standardize JSON parsing for the frontend
    const formattedData = {
      ...interview,
      feedback: typeof interview.feedback === "string" 
        ? JSON.parse(interview.feedback) 
        : (interview.feedback || {}),
      questions: typeof interview.questions === "string" 
        ? JSON.parse(interview.questions) 
        : (interview.questions || []),
    };

    return { success: true, data: serializeData(formattedData) };
  } catch (error) {
    console.error("Database Fetch Error:", error);
    return { success: false, error: "Failed to fetch details" };
  }
}

const QUESTIONS_PROMPT = `You are an expert technical interviewer.
Analyze the job description to identify key responsibilities, required skills, and expected experience.
Generate a structured, relevant, and time-optimized interview plan.

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}

Task:
1. Generate interview questions based on the duration.
2. Match the tone and structure of a real-life {{type}} interview.
3. Use the following JSON format strictly:
{
  "interviewQuestions": [
    {
      "question": "string",
      "type": "Technical/Behavioral/Experience/Problem Solving/Leadership"
    }
  ]
}

IMPORTANT: Return ONLY the JSON object. Do not include any explanations or markdown formatting.`;

/**
 * Creates a new Mock Interview record.
 * Generates questions via AI and saves them immediately to ensure consistency.
 */
export async function createMockInterview(formData) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkUserId } });
    if (!user) throw new Error("User record not found in database");

    // Ensure interviewTypes is always an array for the DB String[] field
    const interviewTypes = Array.isArray(formData.type) 
      ? formData.type 
      : [formData.type || "Technical"];

    // 1. Generate Questions via Groq AI
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: QUESTIONS_PROMPT
            .replace("{{jobTitle}}", formData.jobPosition)
            .replace("{{jobDescription}}", formData.jobDescription)
            .replace("{{duration}}", formData.duration)
            .replace("{{type}}", interviewTypes.join(", ")),
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    // 2. Capture the AI response into a constant
    const aiResponse = JSON.parse(chatCompletion.choices[0].message.content);
    const questionsToSave = aiResponse.interviewQuestions || [];

    console.log("Saving to DB:", JSON.stringify(questionsToSave, null, 2));

    // 3. Store in MockInterview
    const interview = await db.mockInterview.create({
      data: {
        userId: user.id,
        jobPosition: formData.jobPosition,
        jobDescription: formData.jobDescription,
        duration: formData.duration,
        type: interviewTypes, 
        questions:formData.questions || [], // This exact constant is saved
        feedback: {}, 
      },
    });

    // Return the result
    return { success: true, data: serializeData(interview) };
  } catch (error) {
    console.error("Groq Interview Error:", error);
    return { success: false, error: error.message };
  }
}