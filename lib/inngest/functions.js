import { db } from "@/lib/prisma"
import { inngest } from "./client"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { gemini } from "inngest"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

export const generateIndustryInsights = inngest.createFunction(
  { name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" }, // Run every Sunday at midnight
  async ({ event, step }) => {
    const industries = await step.run("Fetch industries", async () => {
      return await db.industryInsight.findMany({
        select: { industry: true },
      })
    })

    for (const { industry } of industries) {
      const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "HIGH" | "MEDIUM" | "LOW",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `

      const res = await step.ai.wrap(
        "gemini",
        async (p) => {
          return await model.generateContent(p)
        },
        prompt,
      )

      const text = res.response.candidates[0].content.parts[0].text || ""
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim()

      const insights = JSON.parse(cleanedText)

      await step.run(`Update ${industry} insights`, async () => {
        await db.industryInsight.update({
          where: { industry },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        })
      })
    }
  },
)

export const AIRoadmapGeneratorAgent = createAgent({
  name: "AIRoadmapGeneratorAgent",
  description: "Generate Details Tree like Flow Roadmap",
  system: `Use this prompt for your AI career agent to ensure the JSON response perfectly matches your frontend requirements:

  "Act as a Senior Career Architect. Generate a high-fidelity React Flow learning roadmap for: [INSERT USER INPUT].

Requirements:
1. Visual Structure: Vertical tree structure. Start at y:0. Each subsequent depth level should increase Y by 150 units. If branching, vary X by 250 units.
2. Content: Order from fundamentals to advanced. Each node data object must include a 'title', 'description' (max 20 words), and a 'link' (valid URL).
3. Technical: Use unique string IDs. All edges must have source and target matching node IDs.
4. Format: Return ONLY raw JSON. No markdown, no backticks.

{
  "roadmapTitle": "Title",
  "description": "3-5 line summary",
  "duration": "Estimated time",
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
}"
`,
  model: gemini({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
  }),
})

