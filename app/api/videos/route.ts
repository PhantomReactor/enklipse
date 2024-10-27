import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { ClipResponse } from "@/types/types";

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

    // Process the clipResponse data as needed
    console.log("Received ClipResponse:", clipResponse);

    // Encode title and revalidate paths
    const encodedTitle = encodeURIComponent(clipResponse.title);
    revalidatePath("/videos");

    const url = new URL(`${request.headers.get("origin")}/generate/video`);
    url.searchParams.set("title", encodedTitle);
    url.searchParams.set("clipId", clipResponse.clipId);

    return NextResponse.redirect(url, {
      status: 303, // See Other
      headers: corsHeaders,
    });
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
