"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";

const serializeData = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getRoadmapById(roadmapId) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const roadmap = await db.roadmap.findUnique({
      where: { id: roadmapId },
      include: {
        user: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!roadmap) return { success: false, error: "Roadmap not found" };

    // Standardize JSON parsing for React Flow frontend
    const formattedData = {
      ...roadmap,
      nodes: typeof roadmap.nodes === "string" ? JSON.parse(roadmap.nodes) : (roadmap.nodes || []),
      edges: typeof roadmap.edges === "string" ? JSON.parse(roadmap.edges) : (roadmap.edges || []),
    };

    return { success: true, data: serializeData(formattedData) };
  } catch (error) {
    console.error("Database Fetch Error:", error);
    return { success: false, error: "Failed to fetch roadmap details" };
  }
}

/**
 * Fetches all roadmaps for the current user to display in History.
 */
export async function getUserRoadmaps() {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkUserId } });
    if (!user) throw new Error("User not found");

    const roadmaps = await db.roadmap.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: serializeData(roadmaps) };
  } catch (error) {
    console.error("Fetch History Error:", error);
    return { success: false, error: "Failed to fetch history" };
  }
}

const ROADMAP_PROMPT = `Act as a Senior Career Architect. Generate a high-fidelity React Flow learning roadmap for: {{jobTitle}}.

Requirements:
1. Visual Structure: Vertical tree structure. Start at y:0. Each subsequent depth level should increase Y by 150 units. If branching, vary X by 250 units.
2. Content: Order from fundamentals to advanced. Each node data object must include a 'title', 'description' (max 20 words), and a 'link' (valid URL for official documentation).
3. Technical: Use unique string IDs. All edges must have source and target matching node IDs.
4. Format: Return ONLY raw JSON. No markdown, no backticks.

Strict JSON Structure:
{
  "roadmapTitle": "string",
  "description": "3-5 line summary",
  "duration": "Estimated time to master",
  "initialNodes": [
    {
      "id": "1",
      "type": "turbo",
      "position": { "x": 0, "y": 0 },
      "data": { "title": "Step Title", "description": "Explanation", "link": "url" }
    }
  ],
  "initialEdges": [
    { "id": "e1-2", "source": "1", "target": "2", "animated": true }
  ]
}`;

/**
 * Generates an AI roadmap via Groq and saves it to the Neon database.
 */
export async function createAIRoadmap(jobTitle) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { clerkUserId } });
    if (!user) throw new Error("User record not found in database");

    // 1. Generate Roadmap via Groq AI
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: ROADMAP_PROMPT.replace("{{jobTitle}}", jobTitle),
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    // 2. Parse AI response
    const aiResponse = JSON.parse(chatCompletion.choices[0].message.content);

    // 3. Store in Roadmap Table
    const roadmap = await db.roadmap.create({
      data: {
        userId: user.id,
        jobTitle: aiResponse.roadmapTitle || jobTitle,
        description: aiResponse.description || "",
        duration: aiResponse.duration || "",
        nodes: aiResponse.initialNodes || [], 
        edges: aiResponse.initialEdges || [],
      },
    });

    return { success: true, data: serializeData(roadmap) };
  } catch (error) {
    console.error("Groq Roadmap Error:", error);
    return { success: false, error: error.message };
  }
}

