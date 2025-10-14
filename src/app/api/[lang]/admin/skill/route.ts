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

export const POST = async (
  request: NextRequest,
  { params }: { params: { lang: string } }
) => {
  await connectDB();
  const body = await request.json();
  try {
    const newSkill = await skillModel.create({ ...body, lang: params.lang });
    return NextResponse.json(newSkill, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { lang: string } }
) => {
  await connectDB();
  const { id } = await request.json();
  try {
    const deletedSkill = await skillModel.findByIdAndDelete({
      _id: id,
      lang: params.lang,
    });
    return NextResponse.json(deletedSkill, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
