import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!API_BASE_URL) {
      return NextResponse.json(
        { error: "API base URL not configured" },
        { status: 500 }
      );
    }

    // Construct the target URL
    const targetUrl = `${API_BASE_URL}/storage/images/${id}`;

    // Prepare headers
    const headers: Record<string, string> = {};

    // Add API key if available
    if (API_KEY) {
      headers["x-api-key"] = API_KEY;
    }

    // Forward relevant headers from the original request
    const forwardHeaders = [
      "if-none-match",
      "if-modified-since",
      "cache-control",
    ];
    forwardHeaders.forEach((headerName) => {
      const headerValue = request.headers.get(headerName);
      if (headerValue) {
        headers[headerName] = headerValue;
      }
    });

    // Make the request to the backend with responseType as stream
    const response = await axios({
      method: "get",
      url: targetUrl,
      headers,
      responseType: "arraybuffer", // Get binary data
      validateStatus: (status) => status < 600, // Don't throw for HTTP error codes
    });

    // If there's an error status, try to parse as JSON error
    if (response.status >= 400) {
      try {
        const errorText = Buffer.from(response.data).toString();
        const errorData = JSON.parse(errorText);
        return NextResponse.json(errorData, { status: response.status });
      } catch {
        return NextResponse.json(
          { error: "Failed to fetch image" },
          { status: response.status }
        );
      }
    }

    // Get content type from backend response
    const contentType = response.headers["content-type"] || "image/jpeg";
    const contentLength = response.headers["content-length"];
    const etag = response.headers["etag"];
    const lastModified = response.headers["last-modified"];
    const cacheControl = response.headers["cache-control"];

    // Create response headers
    const responseHeaders: Record<string, string> = {
      "Content-Type": contentType,
    };

    if (contentLength) {
      responseHeaders["Content-Length"] = contentLength;
    }
    if (etag) {
      responseHeaders["ETag"] = etag;
    }
    if (lastModified) {
      responseHeaders["Last-Modified"] = lastModified;
    }
    if (cacheControl) {
      responseHeaders["Cache-Control"] = cacheControl;
    }

    // Return the binary data as a response
    return new NextResponse(response.data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: unknown) {
    console.error("Image proxy error:", error);

    // Handle axios errors
    if (axios.isAxiosError(error) && error.response) {
      // Try to parse error response
      try {
        const errorText = Buffer.from(error.response.data).toString();
        const errorData = JSON.parse(errorText);
        return NextResponse.json(errorData, { status: error.response.status });
      } catch {
        return NextResponse.json(
          { error: "Backend error" },
          { status: error.response.status }
        );
      }
    }

    // Handle network or other errors
    return NextResponse.json(
      { error: "Internal proxy error" },
      { status: 500 }
    );
  }
}
