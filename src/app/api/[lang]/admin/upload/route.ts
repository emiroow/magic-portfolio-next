import { profileModel } from '@/models/profile';
import { constants } from 'fs';
import { access, mkdir, unlink, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import os from 'os';
import path from 'path';

export async function POST(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get('lang');
  const type = req.nextUrl.searchParams.get('type');

  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Only allow png, jpeg, jpg
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only PNG, JPEG, JPG files are allowed' }, { status: 400 });
    }

    // folder types
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

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer: any = Buffer.from(bytes);

    // Try to write to the project's `public` folder when possible (local dev).
    // In serverless environments like Vercel, the project dir is read-only
    // (e.g. `/var/task`) so fall back to a writable temp dir.
    const candidatePublicDir = path.join(process.cwd(), 'public', folder);
    let uploadDir = candidatePublicDir;
    let usingPublic = true;

    try {
      await access(candidatePublicDir, constants.F_OK);
    } catch (e) {
      // public folder (or the specific subfolder) doesn't exist or is not accessible.
      // Try creating it — this will fail on read-only filesystems like Vercel.
      try {
        await mkdir(candidatePublicDir, { recursive: true });
      } catch (err) {
        // Fallback to OS temp dir when we cannot create `public` (serverless).
        const tmpBase = path.join(os.tmpdir(), 'magic-portfolio', folder);
        await mkdir(tmpBase, { recursive: true });
        uploadDir = tmpBase;
        usingPublic = false;
      }
    }

    const ext = file.type.split('/')[1] === 'jpeg' ? 'jpg' : file.type.split('/')[1];
    var fileName = ``;

    if (type === 'avatar') {
      fileName = `avatarImage.${ext}`;
    } else {
      fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    }

    const filePath = path.join(uploadDir, fileName);

    // clean before Avatar Image
    if (type === 'avatar') {
      const avatarFiles = ['avatarImage.png', 'avatarImage.jpg', 'avatarImage.jpeg'];
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

    // Update in database only if we were able to persist to `public`.
    if (type === 'avatar') {
      if (usingPublic) {
        await profileModel.findOneAndUpdate<IProfile>({ lang }, { avatarUrl: `/avatar/${fileName}` });
      } else {
        // On serverless platforms the filesystem is ephemeral. Persisting a
        // public URL doesn't make sense. Save a temporary marker or handle
        // this case on the client (recommended: configure external storage).
        await profileModel.findOneAndUpdate<IProfile>({ lang }, { avatarUrl: null });
      }
    }

    // return URL. If we wrote to `public`, return the public URL. If we
    // wrote to `/tmp`, return an informational message because that file
    // won't be served publicly and will be removed by platform lifecycle.
    if (usingPublic) {
      return NextResponse.json({
        fileUrl: `/${folder}/${fileName}`,
        message: 'Upload successful',
      });
    }

    return NextResponse.json({
      filePath: filePath,
      message: 'Upload saved to temporary storage (ephemeral). Configure external storage (S3/Cloudinary) for persistent uploads.',
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const fileName = req.nextUrl.searchParams.get('fileName');
  const type = req.nextUrl.searchParams.get('type');

  try {
    // folder types
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

    if (!fileName) {
      return NextResponse.json({ message: 'Filename required' }, { status: 400 });
    }

    const publicPath = path.join(process.cwd(), `public/${folder}`, fileName);
    try {
      await unlink(publicPath);
    } catch (e) {
      // If removing from public fails (e.g. read-only on serverless), try
      // the temp fallback location used by the POST handler.
      try {
        const tmpPath = path.join(os.tmpdir(), 'magic-portfolio', folder, fileName);
        await unlink(tmpPath);
      } catch (err) {
        // Re-throw original error if both attempts fail
        throw e;
      }
    }

    // return URL
    return NextResponse.json(
      {
        message: 'Delete successful',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
