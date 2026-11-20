import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const auth = verifySessionToken(sessionCookie);

  if (!auth.valid) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "products"; // "products" | "videos" | "posters"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const validFolders = ["products", "videos", "posters"];
    const targetFolder = validFolders.includes(folder) ? folder : "products";

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const originalName = file.name || "upload";
    const extension = path.extname(originalName) || "";
    const baseName = path
      .basename(originalName, extension)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .slice(0, 50);

    const uniqueFilename = `${baseName}-${Date.now()}${extension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", targetFolder);

    let savedUrl = `/uploads/${targetFolder}/${uniqueFilename}`;

    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, uniqueFilename);
      fs.writeFileSync(filePath, buffer);
    } catch (fsErr) {
      console.warn("[upload] Filesystem write failed, using base64 fallback:", fsErr);
      // For images and posters, fallback to base64 Data URL so it is fully usable
      if (file.type.startsWith("image/")) {
        savedUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
      } else {
        return NextResponse.json(
          { error: "Could not save video to server storage" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      url: savedUrl,
      filename: uniqueFilename,
      mimeType: file.type,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process file upload" },
      { status: 500 }
    );
  }
}
