import { connectDB } from "@/config/dbConnection";
import { projectModel } from "@/models/project";
import { NextRequest, NextResponse } from "next/server";

// GET all projects for a language
export async function GET(
  request: NextRequest,
  { params }: { params: { lang: string } }
) {
  await connectDB();
  try {
    const projects = await projectModel.find({ lang: params.lang });
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT: Update a project by _id
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
    const updated = await projectModel.findOneAndUpdate(
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

// DELETE: Remove a project by _id
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
    await projectModel.deleteOne({ _id, lang: params.lang });
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

// POST: Create a new project for a language
export async function POST(
  request: NextRequest,
  { params }: { params: { lang: string } }
) {
  await connectDB();
  try {
    const body = await request.json();

    // Basic validation: ensure we have at least a title or name (adjust as needed)
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    // Ensure the document has the correct lang field from route params
    const projectData = { ...body, lang: params.lang };

    const created = await projectModel.create(projectData);

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
