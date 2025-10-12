import { connectDB } from "@/config/dbConnection";
import { skillModel } from "@/models/skill";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { lang: string } }
) => {
  await connectDB();
  try {
    const works = await skillModel.find({ lang: params.lang });
    return NextResponse.json(works, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
