import { connectDB } from "@/config/dbConnection";
import { blogModel } from "@/models/blog";
import { NextRequest, NextResponse } from "next/server";

// GET all blogs for a language (admin)
export async function GET(
  _request: NextRequest,
  { params }: { params: { lang: string } }
) {
  await connectDB();
  try {
    const blogs = await blogModel
      .find({ lang: params.lang })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Create a new blog post for a language
export async function POST(
  request: NextRequest,
  { params }: { params: { lang: string } }
) {
  await connectDB();
  try {
    const body = await request.json();
    const required = ["title", "slug"]; // minimal required
    for (const key of required) {
      if (!body[key]) {
        return NextResponse.json(
          { error: `${key} is required` },
          { status: 400 }
        );
      }
    }
    const created = await blogModel.create({ ...body, lang: params.lang });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT: Update a blog post by _id for a language
export async function PUT(
  request: NextRequest,
  { params }: { params: { lang: string } }
) {
  await connectDB();
  try {
    const body = await request.json();
    const { _id, ...update } = body;
    if (!_id) {
      return NextResponse.json({ error: "_id is required" }, { status: 400 });
    }
    const updated = await blogModel.findOneAndUpdate(
      { _id, lang: params.lang },
      update,
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

// DELETE: Remove a blog post by _id for a language
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
    await blogModel.deleteOne({ _id, lang: params.lang });
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
