import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { getAllVideos, addVideo, deleteVideo } from "@/lib/catalogStore";
import { GalleryVideoItem } from "@/config/videoGallery";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const videos = getAllVideos();
    return NextResponse.json({ success: true, videos });
  } catch (err) {
    console.error("Get videos error:", err);
    return NextResponse.json({ error: "Failed to retrieve videos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const auth = verifySessionToken(sessionCookie);

  if (!auth.valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { src, title, description, poster, aspectRatio } = body;

    if (!src) {
      return NextResponse.json({ error: "Video source is required" }, { status: 400 });
    }

    const cleanId =
      body.id ||
      (title || "video")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-") + `-${Date.now().toString().slice(-4)}`;

    const newVideo: GalleryVideoItem = {
      id: cleanId,
      src: src.trim(),
      title: title?.trim() || "Artisanal Brass Masterpiece",
      description: description?.trim() || "Handcrafted antique brass sculpture in motion.",
      poster: poster?.trim() || undefined,
      aspectRatio: aspectRatio || "portrait",
    };

    const saved = addVideo(newVideo);
    return NextResponse.json({ success: true, video: saved }, { status: 201 });
  } catch (err) {
    console.error("Add video error:", err);
    return NextResponse.json({ error: "Failed to add video" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const auth = verifySessionToken(sessionCookie);

  if (!auth.valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Video id is required" }, { status: 400 });
    }

    const deleted = deleteVideo(id);
    if (!deleted) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Video ${id} deleted` });
  } catch (err) {
    console.error("Delete video error:", err);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
