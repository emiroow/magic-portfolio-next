import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      error:
        "Please use a locale in the last path of URL, admin/fa or admin/en",
    },
    { status: 200 }
  );
}
