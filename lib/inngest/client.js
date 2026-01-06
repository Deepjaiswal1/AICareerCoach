import { Inngest } from "inngest"

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "pathgenie",
  name: "PathGenie",
  credentials: {
    gemini: {
      apikey: process.env.GEMINI_API_KEY,
    },
  },
})
