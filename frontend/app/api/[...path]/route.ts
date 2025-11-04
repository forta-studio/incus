import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest("GET", request, await params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest("POST", request, await params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest("PUT", request, await params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest("DELETE", request, await params);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest("PATCH", request, await params);
}

async function handleRequest(
  method: string,
  request: NextRequest,
  params: { path: string[] }
) {
  try {
    if (!API_BASE_URL) {
      return NextResponse.json(
        { error: "API base URL not configured" },
        { status: 500 }
      );
    }

    // Construct the target URL
    const pathString = params.path.join("/");
    const searchParams = request.nextUrl.searchParams.toString();
    const targetUrl = `${API_BASE_URL}/${pathString}${
      searchParams ? `?${searchParams}` : ""
    }`;

    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add API key if available
    if (API_KEY) {
      headers["x-api-key"] = API_KEY;
    }

    // Forward other headers from the original request (excluding host)
    request.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "host" && key.toLowerCase() !== "connection") {
        headers[key] = value;
      }
    });

    // Prepare request body for methods that support it
    let data = undefined;
    if (["POST", "PUT", "PATCH"].includes(method)) {
      try {
        data = await request.json();
      } catch {
        // If JSON parsing fails, try to get text
        try {
          data = await request.text();
        } catch {
          // If both fail, proceed without body
        }
      }
    }

    // Make the request to the backend
    const response = await axios({
      method: method.toLowerCase(),
      url: targetUrl,
      headers,
      data,
      validateStatus: (status) => status < 600, // Don't throw for HTTP error codes
    });

    // Return the response with the same status and headers
    return NextResponse.json(response.data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: unknown) {
    console.error("Proxy error:", error);

    // Handle axios errors
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        error.response.data || { error: "Backend error" },
        { status: error.response.status }
      );
    }

    // Handle network or other errors
    return NextResponse.json(
      { error: "Internal proxy error" },
      { status: 500 }
    );
  }
}
