import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "get data" }, { status: 200 });
}
