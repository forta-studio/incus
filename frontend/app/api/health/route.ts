import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "API proxy is working!",
    timestamp: new Date().toISOString(),
    environment: {
      apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      hasApiKey: !!process.env.NEXT_PUBLIC_API_KEY,
    },
  });
}
