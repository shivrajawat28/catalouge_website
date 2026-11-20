import { NextResponse } from "next/server";
import { loadCatalogStore } from "@/lib/catalogStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = loadCatalogStore();
    return NextResponse.json(
      {
        success: true,
        categories: store.categories,
        products: store.products,
        videos: store.videos,
        totalProducts: store.products.length,
        totalVideos: store.videos.length,
        updatedAt: store.updatedAt,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Catalog API error:", error);
    return NextResponse.json(
      { error: "Failed to load catalogue data" },
      { status: 500 }
    );
  }
}
