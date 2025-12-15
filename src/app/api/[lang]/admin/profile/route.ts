import { profileModel } from "@/models/profile";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  try {
    const { lang } = await params;
    const profile = await profileModel.findOne({ lang });
    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  try {
    const body = await request.json();
    const { lang } = await params;
    const profile = await profileModel.findOneAndUpdate(
      { lang },
      { ...body },
      { new: true }
    );
    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
