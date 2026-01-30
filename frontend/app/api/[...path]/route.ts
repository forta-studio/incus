import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleRequest("GET", request, await params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleRequest("POST", request, await params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleRequest("PUT", request, await params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleRequest("DELETE", request, await params);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleRequest("PATCH", request, await params);
}

async function handleRequest(
  method: string,
  request: NextRequest,
  params: { path: string[] },
) {
  try {
    if (!API_BASE_URL) {
      return NextResponse.json(
        { error: "API base URL not configured" },
        { status: 500 },
      );
    }

    // Construct the target URL
    const pathString = params.path.join("/");
    const searchParams = request.nextUrl.searchParams.toString();
    const targetUrl = `${API_BASE_URL}/${pathString}${
      searchParams ? `?${searchParams}` : ""
    }`;

    // Prepare headers: clone incoming headers, remove hop-by-hop ones,
    // and inject API key if present. Preserve original Content-Type so
    // multipart/form-data and other encodings are forwarded correctly.
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (
        lower === "host" ||
        lower === "connection" ||
        lower === "content-length"
      ) {
        return;
      }
      headers.set(key, value);
    });

    if (API_KEY) {
      headers.set("x-api-key", API_KEY);
    }

    const hasBody = ["POST", "PUT", "PATCH"].includes(method);

    // Build fetch init, including streaming body for uploads.
    // duplex is a Node fetch extension for streaming request body (not in standard RequestInit).
    type FetchInitWithDuplex = RequestInit & { duplex?: "half" };
    const fetchInit: FetchInitWithDuplex = {
      method,
      headers,
      redirect: "manual",
    };

    if (hasBody) {
      fetchInit.body = request.body;
      fetchInit.duplex = "half";
    }

    // Make the request to the backend using fetch so we can stream the body
    const backendResponse = await fetch(targetUrl, fetchInit);

    // Stream the response back to the client
    const responseHeaders = new Headers(backendResponse.headers);
    // Ensure we don't set an invalid Content-Encoding for proxied responses
    responseHeaders.delete("content-encoding");

    const body = backendResponse.body ? backendResponse.body : null;
    return new NextResponse(body, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch (error: unknown) {
    console.error("Proxy error:", error);

    // Handle network or other errors
    return NextResponse.json(
      { error: "Internal proxy error" },
      { status: 500 },
    );
  }
}
