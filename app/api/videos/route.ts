import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ClipResponse } from "@/types/types";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  // Add CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:8080",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const clipResponse: ClipResponse = await request.json();
    if (!clipResponse || !clipResponse.clipId) {
      return NextResponse.json(
        { error: "No clip response data received" },
        { status: 400, headers: corsHeaders }
      );
    }
    // Process the clipResponse data as needed
    console.log("Received ClipResponse:", clipResponse);

    // Encode title and revalidate paths
    const encodedTitle = encodeURIComponent(clipResponse.title);
    revalidatePath("/videos");
    revalidatePath(`/generate/video/${clipResponse.clipId}`);
    redirect(`/generate/video/${clipResponse.clipId}`);

    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Error processing video data:", error);
    return NextResponse.json(
      { error: "Failed to process video data" },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
