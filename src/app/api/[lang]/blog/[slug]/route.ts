import { connectDB } from "@/config/dbConnection";
import { blogModel } from "@/models/blog";
import { NextRequest, NextResponse } from "next/server";

// GET: Public blog post by slug for a given language
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ lang: string; slug: string }> }
) {
  const { lang, slug } = await params;
  try {
    await connectDB();
    const doc: any = await blogModel.findOne({ lang, slug }).lean();
    if (doc) {
      return NextResponse.json(
        {
          title: doc.title,
          summary: doc.summary,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          content: doc.content, // assumed to be HTML or Markdown managed by admin
          slug: doc.slug,
          lang: doc.lang,
        },
        { status: 200 }
      );
    }

    // Not found in DB
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
}
