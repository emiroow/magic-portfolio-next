import { profileModel } from "@/models/profile";
import { access, constants, mkdir, unlink, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get("lang");
  const type = req.nextUrl.searchParams.get("type");

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

    // folder types
    let folder = "others";
    switch (type) {
      case "avatar":
        folder = "avatar";
        break;
      case "project":
        folder = "projects";
        break;
      case "education":
        folder = "education";
        break;
      case "experience":
        folder = "experience";
        break;
      case "blog":
        folder = "blog";
        break;
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer: any = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", folder);

    try {
      await access(uploadDir, constants.F_OK);
    } catch {
      await mkdir(uploadDir, { recursive: true });
    }

    const ext =
      file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
    var fileName = ``;

    if (type === "avatar") {
      fileName = `avatarImage.${ext}`;
    } else {
      fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${ext}`;
    }

    const filePath = path.join(uploadDir, fileName);

    // clean before Avatar Image
    if (type === "avatar") {
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
    }

    // create file
    await writeFile(filePath, buffer);

    // Update in database
    if (type === "avatar") {
      await profileModel.findOneAndUpdate<IProfile>(
        { lang },
        { avatarUrl: `/avatar/${fileName}` }
      );
    }

    // return URL
    return NextResponse.json({
      fileUrl: `/${folder}/${fileName}`,
      message: "Upload successful",
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const fileName = req.nextUrl.searchParams.get("fileName");
  const type = req.nextUrl.searchParams.get("type");

  try {
    // folder types
    let folder = "others";
    switch (type) {
      case "avatar":
        folder = "avatar";
        break;
      case "project":
        folder = "projects";
        break;
      case "education":
        folder = "education";
        break;
      case "experience":
        folder = "experience";
        break;
      case "blog":
        folder = "blog";
        break;
    }

    if (!fileName) {
      return NextResponse.json(
        { message: "Filename required" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), `public/${folder}`, fileName);
    await unlink(filePath);

    // return URL
    return NextResponse.json(
      {
        message: "Delete successful",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
