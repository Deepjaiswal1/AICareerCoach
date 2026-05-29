import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get('clerkId');

    if (!clerkId) {
      return NextResponse.json({ error: "No Clerk ID provided" }, { status: 400 });
    }

    // 1. Find the internal database User record using the Clerk ID
    const userRecord = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!userRecord) {
      return NextResponse.json([]); // No user found, return empty list
    }

    // 2. Fetch all interviews from MockInterview using the internal database ID
    const interviews = await db.mockInterview.findMany({
      where: {
        userId: userRecord.id, // This will now match 'cbfdf1de...'
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(interviews);
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}