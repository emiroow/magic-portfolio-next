import { profileModel } from "@/models/profile";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { lang: string } }
) {
  try {
    const profile = await profileModel.findOne({ lang: params.lang });
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
  { params }: { params: { lang: string } }
) {
  try {
    const profile = await profileModel.findOneAndUpdate(
      { lang: params.lang },
      { ...request.body },
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
