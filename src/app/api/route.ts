import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      error: "Please use a locale in the last path of URL, api/fa or api/en",
    },
    { status: 200 }
  );
}
