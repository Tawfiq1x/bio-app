import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.startsWith('multipart/form-data')) {
    return NextResponse.json({ error: 'Invalid Content-Type' }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file || !file.name) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // ✅ File type validation
  const allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',    // 🎉 Added GIF support
    'audio/mpeg',
    'audio/mp3',
  ];

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
  }

  // ✅ Size limit (~5MB)
  const maxSize = 5 * 1024 * 1024;
  if (buffer.length > maxSize) {
    return NextResponse.json({ error: 'File too large' }, { status: 413 });
  }

  // ✅ Safe, unique filename
  const ext = path.extname(file.name);
  const hash = crypto.randomBytes(8).toString('hex');
  const filename = `${Date.now()}_${hash}${ext}`;
  const filepath = path.join(process.cwd(), 'public/uploads', filename);

  await writeFile(filepath, buffer);

  const fileUrl = `/uploads/${filename}`;
  return NextResponse.json({ success: true, url: fileUrl });
}
