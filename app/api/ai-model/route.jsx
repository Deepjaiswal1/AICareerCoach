import { QUESTIONS_PROMPT } from "@/services/Constants"
import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
export async function POST(req) {
  try {
    const { jobPosition, jobDescription, duration, type } = await req.json();

    // 1. Validation: Ensure variables exist before replacing
    if (!jobPosition || !jobDescription) {
       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const interviewType = Array.isArray(type) ? type.join(", ") : type;

    const FINAL_PROMPT = QUESTIONS_PROMPT
      .replace('{{jobTitle}}', jobPosition)
      .replace('{{jobDescription}}', jobDescription)
      .replace('{{duration}}', duration)
      .replace('{{type}}', interviewType);
 
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Use stable model name

    const result = await model.generateContent(FINAL_PROMPT);
    let text = result.response.text();

    // 2. Clean the string: Remove markdown code blocks if they exist
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return NextResponse.json({
      role: "assistant",
      content: cleanText, // This will now be a valid JSON string
    });
  } catch (e) {
    console.error("Error in API Route:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}