import { profileModel } from "@/models/profile";
import { unlink, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get("lang");
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Only allow png, jpeg, jpg
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PNG, JPEG, JPG files are allowed" },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save in public/avatar
    const uploadDir = path.join(process.cwd(), "public", "avatar");
    const ext =
      file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
    const fileName = `avatarImage.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    // Delete previous avatar files (png, jpg, jpeg)
    const avatarFiles = [
      "avatarImage.png",
      "avatarImage.jpg",
      "avatarImage.jpeg",
    ];
    for (const f of avatarFiles) {
      try {
        await unlink(path.join(uploadDir, f));
      } catch (e) {
        // ignore if file does not exist
      }
    }

    await writeFile(filePath, buffer);

    const updateUrl = await profileModel.findOneAndUpdate<IProfile>(
      { lang },
      { avatarUrl: `/avatar/${fileName}` }
    );

    return NextResponse.json({
      avatarUrl: updateUrl?.avatarUrl,
      message: "Upload successful",
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
