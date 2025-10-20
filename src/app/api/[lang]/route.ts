import { connectDB } from "@/config/dbConnection";
import { educationModel } from "@/models/education";
import { profileModel } from "@/models/profile";
import { projectModel } from "@/models/project";
import { skillModel } from "@/models/skill";
import { socialModel } from "@/models/social";
import { workModel } from "@/models/work";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) => {
  const lang = (await params).lang;
  await connectDB();
  try {
    const profile = await profileModel.findOne({ lang });
    const educations = await educationModel.find({ lang });
    const projects = await projectModel.find({ lang });
    const works = await workModel.find({ lang });
    const socials = await socialModel.find({ lang });
    const skills = await skillModel.find({ lang });
    return NextResponse.json(
      { profile, educations, projects, works, socials, skills },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
