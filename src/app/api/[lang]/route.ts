import { connectDB } from "@/config/dbConnection";
import { educationModel } from "@/models/education";
import { projectModel } from "@/models/project";
import { skillModel } from "@/models/skill";
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
    const educations = await educationModel.find({ lang });
    const projects = await projectModel.find({ lang });
    const works = await workModel.find({ lang });
    const socials = await socialModel.find();
    const skills = await skillModel.find({ lang });
    return NextResponse.json(
      { user, educations, projects, works, socials, skills },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
