import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("URL is required", { status: 400 });
  }

  try {
    const response = await fetch(url);
    const blob = await response.blob();

    // Get the content type from the original response
    const contentType = response.headers.get("content-type") || "application/octet-stream";
    
    // Get the filename from the URL
    const fileName = url.split("/").pop() || "download";

    return new NextResponse(blob, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return new NextResponse("Error downloading file", { status: 500 });
  }
}
