// import { NextResponse } from 'next/server';
// import { generateRoadmap, extractSearchParams } from '@/app/lib/ai-service';
// import { connectDB } from '@/app/lib/db';
// import { parsePdf } from '@/app/lib/pdf-loader';

// export async function POST(req: Request) {
//     try {
//         await connectDB();
//         const formData = await req.formData();
//         const file = formData.get('resume') as File;

//         if (!file) {
//             return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//         }

//         const buffer = Buffer.from(await file.arrayBuffer());

//         // Use the fixed helper to extract text
//         const pdfData = await parsePdf(buffer);
//         const resumeText = pdfData.text.replace(/\0/g, '').trim();

//         if (resumeText.length < 50) {
//             return NextResponse.json({ error: "Resume text too short." }, { status: 400 });
//         }

//         const searchParams = await extractSearchParams(resumeText);
//         const roadmap = await generateRoadmap(resumeText, searchParams);

//         return NextResponse.json({
//             analysis: roadmap,
//             searchParams: searchParams
//         });

//     } catch (error: any) {
//         console.error("Roadmap Route Error:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }

import { NextResponse } from 'next/server';
import { generateRoadmap, extractSearchParams } from '@/app/lib/ai-service';
import { connectDB } from '@/app/lib/db';
import { parsePdf } from '@/app/lib/pdf-loader';

export const maxDuration = 60; // Crucial for Vercel/Next.js 15 timeouts

export async function POST(req: Request) {
    try {
        // 1. Ensure DB is connected
        try {
            await connectDB();
        } catch (dbErr) {
            console.error("Database Connection Error:", dbErr);
            return NextResponse.json({ error: "Service temporarily unavailable (DB)" }, { status: 503 });
        }

        const formData = await req.formData();
        const file = formData.get('resume') as File;

        if (!file || file.size === 0) {
            return NextResponse.json({ error: "Empty or missing file." }, { status: 400 });
        }

        // 2. Process File Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 3. Parse PDF
        const pdfData = await parsePdf(buffer);
        const resumeText = pdfData.text.replace(/\0/g, '').trim();

        if (resumeText.length < 50) {
            return NextResponse.json({ 
                error: "The PDF appears to be an image or contains insufficient text. Please use a text-based PDF." 
            }, { status: 400 });
        }

        // 4. AI Logic
        const searchParams = await extractSearchParams(resumeText);
        const roadmap = await generateRoadmap(resumeText, searchParams);

        return NextResponse.json({
            analysis: roadmap,
            searchParams: searchParams
        });

    } catch (error: any) {
        console.error("Roadmap Route Error:", error);
        return NextResponse.json({ 
            error: error.message || "Internal Server Error" 
        }, { status: 500 });
    }
}