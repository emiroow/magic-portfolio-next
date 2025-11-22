import { profileModel } from '@/models/profile';
import { del, put } from '@vercel/blob';
import { constants } from 'fs';
import { access, mkdir, unlink, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export async function POST(req: NextRequest) {
  // Prefer explicit `lang` query param, fall back to the dynamic route segment.
  const langQuery = req.nextUrl.searchParams.get('lang');
  const langFromPath = req.nextUrl.pathname.split('/')[2];
  const lang = langQuery ?? langFromPath ?? null;

  const type = req.nextUrl.searchParams.get('type');

  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only PNG, JPEG, JPG files are allowed' }, { status: 400 });
    }

    let folder = 'others';
    switch (type) {
      case 'avatar':
        folder = 'avatar';
        break;
      case 'project':
        folder = 'projects';
        break;
      case 'education':
        folder = 'education';
        break;
      case 'experience':
        folder = 'experience';
        break;
      case 'blog':
        folder = 'blog';
        break;
    }

    const ext = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1];
    const fileName = type === 'avatar' ? `avatarImage.${ext}` : `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    // ---------------------------------------
    // 🔥 DEVELOPMENT MODE → save to /public
    // ---------------------------------------
    if (isDev) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), 'public', folder);

      // Ensure folder exists
      try {
        await access(uploadDir, constants.F_OK);
      } catch {
        await mkdir(uploadDir, { recursive: true });
      }

      // If avatar → cleanup old versions
      if (type === 'avatar') {
        const oldFiles = ['avatarImage.png', 'avatarImage.jpg', 'avatarImage.jpeg'];
        for (const f of oldFiles) {
          try {
            await unlink(path.join(uploadDir, f));
          } catch {}
        }
      }

      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      const fileUrl = `${siteUrl}/${folder}/${fileName}`;

      if (type === 'avatar') {
        await profileModel.findOneAndUpdate({ lang }, { avatarUrl: fileUrl });
      }

      return NextResponse.json({
        fileUrl,
        message: 'Upload successful (DEV MODE)',
      });
    }

    // ---------------------------------------
    // 🔥 PRODUCTION MODE → upload to BLOB
    // ---------------------------------------
    const { url } = await put(`${folder}/${fileName}`, file, {
      access: 'public',
      allowOverwrite: true,
    });

    if (type === 'avatar') {
      await profileModel.findOneAndUpdate({ lang }, { avatarUrl: url });
    }

    return NextResponse.json({
      fileUrl: url,
      message: 'Upload successful',
    });
  } catch (err) {
    console.error('AVATAR UPLOAD ERROR →', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const fileName = req.nextUrl.searchParams.get('fileName');
  const type = req.nextUrl.searchParams.get('type');

  if (!fileName) {
    return NextResponse.json({ error: 'Filename required' }, { status: 400 });
  }

  let folder = 'others';
  switch (type) {
    case 'avatar':
      folder = 'avatar';
      break;
    case 'project':
      folder = 'projects';
      break;
    case 'education':
      folder = 'education';
      break;
    case 'experience':
      folder = 'experience';
      break;
    case 'blog':
      folder = 'blog';
      break;
  }

  try {
    // ---------------------------------------
    // 🔥 DEVELOPMENT MODE → delete from public
    // ---------------------------------------
    if (isDev) {
      const filePath = path.join(process.cwd(), 'public', folder, fileName);
      await unlink(filePath);
      return NextResponse.json({ message: 'Delete successful (DEV MODE)' });
    }

    // ---------------------------------------
    // 🔥 PRODUCTION MODE → delete from Blob
    // ---------------------------------------
    await del(`${folder}/${fileName}`);

    return NextResponse.json({
      message: 'Delete successful',
    });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
