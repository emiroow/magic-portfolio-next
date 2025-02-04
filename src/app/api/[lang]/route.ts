import { connectDB } from "@/config/dbConnection";
import { educationModel } from "@/models/education";
import { socialModel } from "@/models/social";
import { userModel } from "@/models/user";
import { workModel } from "@/models/work";
import { NextRequest, NextResponse } from "next/server";
export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) => {
  const lang = (await params).lang;
  await connectDB();
  try {
    const user = await userModel.findOne({ lang });
    const education = await educationModel.find({ lang });
    const work = await workModel.find({ lang });
    const social = await socialModel.find();

    return NextResponse.json(
      { user, education, work, social },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
