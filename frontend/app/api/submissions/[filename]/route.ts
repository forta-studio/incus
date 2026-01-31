import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    if (!filename || !API_BASE_URL) {
      return NextResponse.json(
        { error: "API base URL not configured" },
        { status: 500 }
      );
    }

    const targetUrl = `${API_BASE_URL}/storage/submissions/stream/${encodeURIComponent(filename)}`;

    const headers: Record<string, string> = {};
    if (API_KEY) {
      headers["x-api-key"] = API_KEY;
    }

    // Forward Range header for audio seeking
    const range = request.headers.get("range");
    if (range) {
      headers["range"] = range;
    }

    const response = await axios({
      method: "get",
      url: targetUrl,
      headers,
      responseType: "arraybuffer",
      validateStatus: (status) => status < 600,
    });

    if (response.status >= 400) {
      try {
        const errorText = Buffer.from(response.data).toString();
        const errorData = JSON.parse(errorText);
        return NextResponse.json(errorData, { status: response.status });
      } catch {
        return NextResponse.json(
          { error: "Failed to fetch submission audio" },
          { status: response.status }
        );
      }
    }

    const responseHeaders: Record<string, string> = {
      "Content-Type": response.headers["content-type"] || "audio/mpeg",
    };

    const contentLength = response.headers["content-length"];
    if (contentLength) {
      responseHeaders["Content-Length"] = contentLength;
    }

    const contentRange = response.headers["content-range"];
    if (contentRange) {
      responseHeaders["Content-Range"] = contentRange;
    }

    const acceptRanges = response.headers["accept-ranges"];
    if (acceptRanges) {
      responseHeaders["Accept-Ranges"] = acceptRanges;
    }

    const cacheControl = response.headers["cache-control"];
    if (cacheControl) {
      responseHeaders["Cache-Control"] = cacheControl;
    }

    return new NextResponse(response.data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: unknown) {
    console.error("Submission audio proxy error:", error);

    if (axios.isAxiosError(error) && error.response) {
      try {
        const errorText = Buffer.from(error.response.data || "").toString();
        const errorData = JSON.parse(errorText);
        return NextResponse.json(errorData, { status: error.response.status });
      } catch {
        return NextResponse.json(
          { error: "Backend error" },
          { status: error.response.status }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal proxy error" },
      { status: 500 }
    );
  }
}
