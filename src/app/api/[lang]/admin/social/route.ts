import { connectDB } from "@/config/dbConnection";
import { socialModel } from "@/models/social";
import { NextRequest, NextResponse } from "next/server";

// GET all socials for a language
export async function GET(
  request: NextRequest,
  { params }: { params: { lang: string } }
) {
  await connectDB();
  try {
    const socials = await socialModel.find({ lang: params.lang });
    return NextResponse.json(socials, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Create a new social for a language
export async function POST(
  request: NextRequest,
  { params }: { params: { lang: string } }
) {
  await connectDB();
  try {
    const body = await request.json();
    const { name, url, icon } = body || {};
    if (!name || !url || !icon) {
      return NextResponse.json(
        { error: "name, url and icon are required" },
        { status: 400 }
      );
    }
    const created = await socialModel.create({
      name,
      url,
      icon,
      lang: params.lang,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT: Update a social by _id
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
    const updated = await socialModel.findOneAndUpdate(
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

// DELETE: Remove a social by _id
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
    await socialModel.deleteOne({ _id, lang: params.lang });
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
