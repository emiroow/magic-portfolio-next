import { NextResponse } from "next/server";

// GET request handler
export async function GET() {
  return NextResponse.json({ message: "Hi" }, { status: 200 });
}
