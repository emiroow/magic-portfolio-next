import { connectDB } from "@/config/dbConnection";
import { educationModel } from "@/models/education";
import { NextRequest, NextResponse } from "next/server";

// GET all education for a language
export async function GET(
  request: NextRequest,
  { params }: { params: { lang: string } }
) {
  await connectDB();
  try {
    const educations = await educationModel.find({ lang: params.lang });
    return NextResponse.json(educations, { status: 200 });
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
  await connectDB();
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const updated = await educationModel.findOneAndUpdate(
      { _id: id, lang: params.lang },
      updateData,
      { new: true }
    );
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { lang: string } }
) {
  await connectDB();
  try {
    const body = await request.json();
    const created = await educationModel.create({ ...body, lang: params.lang });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { lang: string } }
) {
  await connectDB();
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    await educationModel.findOneAndDelete({ _id: id, lang: params.lang });
    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
