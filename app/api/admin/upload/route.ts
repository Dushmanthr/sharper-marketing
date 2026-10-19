import { NextResponse } from "next/server";
import { getSessionAdmin } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

// 10 MB maximum upload size
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);

export async function POST(req: Request) {
  // 1. Authenticate admin user
  const session = await getSessionAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    // 2. Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed formats: PNG, JPG, WEBP, GIF, SVG, AVIF." },
        { status: 400 }
      );
    }

    // 3. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 10MB limit. Please upload a compressed image." },
        { status: 400 }
      );
    }

    // 4. Derive safe file name and extension
    const originalName = file.name || "image.png";
    const parsedExt = path.extname(originalName).toLowerCase();
    const fallbackExt = file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg";
    const extension = parsedExt || fallbackExt;

    const baseName = path
      .basename(originalName, parsedExt)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40);

    const fileName = `cover-${Date.now()}-${baseName}${extension}`;

    // 5. Ensure storage directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "blogs");
    await fs.mkdir(uploadDir, { recursive: true });

    // 6. Write binary buffer to disk
    const filePath = path.join(uploadDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/blogs/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: file.size,
      mimeType: file.type,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload image.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
