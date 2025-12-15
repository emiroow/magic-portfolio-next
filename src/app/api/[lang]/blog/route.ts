import { connectDB } from "@/config/dbConnection";
import { blogModel } from "@/models/blog";
import { NextRequest, NextResponse } from "next/server";

// GET: Public list of blog posts for a given language
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;
  try {
    await connectDB();
    const docs = await blogModel.find({ lang }).sort({ createdAt: -1 }).lean();

    return NextResponse.json(docs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// NOTE: Duplicate placeholder implementation removed. See the GET above.
