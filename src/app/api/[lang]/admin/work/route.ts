import { connectDB } from "@/config/dbConnection";
import { workModel } from "@/models/work";
import { NextRequest, NextResponse } from "next/server";

// GET all work experiences for a language
export async function GET(
  request: NextRequest,
  { params }: { params: { lang: string } }
) {
  await connectDB();
  try {
    const works = await workModel.find({ lang: params.lang });
    return NextResponse.json(works, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT: Update a work experience by _id
export async function PUT(
  request: NextRequest,
  { params }: { params: { lang: string } }
) {
  await connectDB();
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;
    if (!_id) {
      return NextResponse.json({ error: "_id is required" }, { status: 400 });
    }
    const updated = await workModel.findOneAndUpdate(
      { _id, lang: params.lang },
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

// DELETE: Remove a work experience by _id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { lang: string } }
) {
  await connectDB();
  try {
    const body = await request.json();
    const { _id } = body;
    if (!_id) {
      return NextResponse.json({ error: "_id is required" }, { status: 400 });
    }
    await workModel.deleteOne({ _id, lang: params.lang });
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
