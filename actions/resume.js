"use server"

import { db } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { revalidatePath } from "next/cache"
// import pdf from "pdf-parse";
import PDFParser from "pdf2json"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

// export async function saveResume(content) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   try {
//     const resume = await db.resume.upsert({
//       where: {
//         userId: user.id,
//       },
//       update: {
//         content,
//       },
//       create: {
//         userId: user.id,
//         content,
//       },
//     })

//     revalidatePath("/resume")
//     return resume
//   } catch (error) {
//     console.error("Error saving resume:", error)
//     throw new Error("Failed to save resume")
//   }
// }

export async function getResume() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  })

  if (!user) throw new Error("User not found")

  return await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  })
}

export async function improveWithAI({ current, type }) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  })

  if (!user) throw new Error("User not found")

  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    const improvedContent = response.text().trim()
    return improvedContent
  } catch (error) {
    console.error("Error improving content:", error)
    throw new Error("Failed to improve content")
  }
}

export async function extractTextFromPDF(formData) {
  try {
    const file = formData.get("file")
    if (!file) throw new Error("No file uploaded")

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const pdfParser = new PDFParser(null, 1) // "1" means text-only mode

    return new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData) =>
        reject(errData.parserError),
      )
      pdfParser.on("pdfParser_dataReady", () => {
        const text = pdfParser.getRawTextContent()
        resolve({ success: true, text })
      })

      pdfParser.parseBuffer(buffer)
    })
  } catch (error) {
    console.error("PDF Extraction Error:", error)
    return {
      success: false,
      error: "Failed to parse PDF. The file might be protected or corrupt.",
    }
  }
}

export async function analyzeResume(resumeText, jobDescription) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!user) throw new Error("User profile not found")

    const prompt = `
      Analyze the following resume against the provided job description.
      
      RESUME:
      ${resumeText}

      JOB DESCRIPTION:
      ${jobDescription}

      CRITICAL EVALUATION:
      1. Evaluate document structure and formatting.
      2. Check for: Lack of quantifiable achievements (%, $), weak action verbs, missing contact info/LinkedIn, and dense text blocks.
      3. Identify missing technical and soft keywords.

      Return ONLY a JSON object in this exact format:
      {
        "jobTitle": "Extract the specific job title from the description",
        "matchPercentage": number (0-100),
        "summary": "2-3 sentence overview of compatibility",
        "missingKeywords": ["keyword1", "keyword2"],
        "formattingIssues": ["issue1", "issue2"],
        "suggestions": ["suggestion1", "suggestion2"]
      }
    `

    const result = await model.generateContent(prompt)
    const rawText = result.response.text()
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)

    if (!jsonMatch) throw new Error("Invalid AI response")

    // Parse AI result
    const analysis = JSON.parse(jsonMatch[0])

    // PREVENT CRASH: Create a safe data object with defaults
    // This ensures formattingIssues is never missing even if the AI forgets it
    const analysisData = {
      userId,
      jobTitle: analysis.jobTitle || "Strategic Position",
      matchPercentage: parseInt(analysis.matchPercentage) || 0,
      summary: analysis.summary || "No summary provided",
      missingKeywords: Array.isArray(analysis.missingKeywords)
        ? analysis.missingKeywords
        : [],
      formattingIssues: Array.isArray(analysis.formattingIssues)
        ? analysis.formattingIssues
        : [],
      suggestions: Array.isArray(analysis.suggestions)
        ? analysis.suggestions
        : [],
    }

    // Save to Database
    const savedAnalysis = await db.resumeAnalysis.create({
      data: analysisData,
    })

    revalidatePath("/resume-check/resume-history")
    return { success: true, data: savedAnalysis }
  } catch (error) {
    console.error("Analysis Error:", error)
    return { success: false, error: error.message }
  }
}

export async function getAnalysisHistory() {
  const { userId } = await auth()
  if (!userId) return []

  return await db.resumeAnalysis.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  })
}

export async function getResumeHistory() {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const history = await db.resumeAnalysis.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, data: history }
  } catch (error) {
    console.error("Fetch History Error:", error)
    return { success: false, error: error.message }
  }
}

export async function getAnalysisById(id) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const analysis = await db.resumeAnalysis.findUnique({
      where: {
        id,
        userId, // Ensure users can't see each other's data
      },
    })

    return { success: true, data: analysis }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function generateFullResume(jobDescription, currentData) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      As an expert resume writer, rewrite this resume to perfectly match the provided Job Description.
      
      JOB DESCRIPTION: "${jobDescription}"
      CURRENT DATA: ${JSON.stringify(currentData)}

      REWRITE RULES:
      1. Summary: High-impact, 2-3 sentences using keywords from the JD.
      2. Experience: Keep the company/role, but rewrite descriptions to focus on relevant achievements.
      3. Projects: Focus on the technical stack mentioned in the JD.
      4. Skills: Provide a comma-separated list of the most relevant skills.

      Return ONLY a JSON object:
      {
        "summary": "string",
        "experience": [{"description": "string"}],
        "projects": [{"description": "string"}],
        "skills": "string"
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/```json|```/g, "").trim();
    return { success: true, data: JSON.parse(cleanedText) };
  } catch (error) {
    console.error(error);
    return { success: false, error: "AI Generation failed" };
  }
}


export async function saveResume(data) {
  try {
    const { userId: clerkId } = await auth();
    const user = await currentUser();
    
    if (!clerkId || !user) throw new Error("Unauthorized");

    // 1. Ensure User exists (Syncing Clerk to DB)
    await db.user.upsert({
      where: { clerkUserId: clerkId },
      update: {
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl,
      },
      create: { 
        clerkUserId: clerkId, 
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        imageUrl: user.imageUrl,
      },
    });

    // 2. CREATE A NEW RESUME VERSION
    // We use .create instead of .upsert to build a history trail
    const resume = await db.resume.create({
      data: {
        userId: clerkId, // References User.clerkUserId
        content: data,   // Prisma handles the JSON mapping
      },
    });

    return { success: true, data: resume };
  } catch (error) {
    console.error("RESUME_SAVE_ERROR:", error);
    return { success: false, error: error.message };
  }
}

export async function getResumeHistoryy() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const resumes = await db.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    return { success: true, data: resumes };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteResume(resumeId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db.resume.delete({
      where: { 
        id: resumeId,
        userId: userId // Security check: ensure the user owns this resume
      },
    });

    return { success: true };
  } catch (error) {
    console.error("DELETE_RESUME_ERROR:", error);
    return { success: false, error: error.message };
  }
}