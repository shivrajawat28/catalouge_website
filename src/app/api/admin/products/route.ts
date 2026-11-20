import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/catalogStore";
import { ProductItem } from "@/config/siteConfig";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = getAllProducts();
    return NextResponse.json({ success: true, products });
  } catch (err) {
    console.error("Get products error:", err);
    return NextResponse.json({ error: "Failed to retrieve products" }, { status: 500 });
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
    const {
      name,
      subtitle,
      category,
      categoryLabel,
      tagline,
      dimension,
      material,
      weight,
      availableSizes,
      description,
      image,
      featured,
    } = body;

    if (!name || !image || !category) {
      return NextResponse.json(
        { error: "Name, category, and image are required" },
        { status: 400 }
      );
    }

    const cleanId =
      body.id ||
      name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-");

    const newProduct: ProductItem = {
      id: cleanId,
      name: name.trim(),
      title: name.trim(),
      subtitle: subtitle?.trim() || "Antique Brass Idol",
      category: category.trim(),
      categoryLabel: categoryLabel?.trim() || (category === "buddha" ? "Buddha Statues" : category === "hindu" ? "Hindu Statues" : name),
      tagline: tagline?.trim() || "A timeless symbol of sacred artistry and devotion.",
      dimension: dimension?.trim() || "Available in multiple bespoke sizes",
      material: material?.trim() || "Solid Antique Brass (Lost-Wax Cast)",
      weight: weight?.trim() || "Multiple weight tiers",
      availableSizes: Array.isArray(availableSizes) && availableSizes.length > 0
        ? availableSizes
        : [{ height: "Custom Size", weight: "On Request" }],
      description: description?.trim() || "",
      image: image.trim(),
      sourcePage: body.sourcePage || 1,
      code: body.code || `AT-${Date.now().toString().slice(-4)}`,
      featured: Boolean(featured),
    };

    const saved = addProduct(newProduct);
    return NextResponse.json({ success: true, product: saved }, { status: 201 });
  } catch (err) {
    console.error("Add product error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const auth = verifySessionToken(sessionCookie);

  if (!auth.valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Product id is required" }, { status: 400 });
    }

    const updated = updateProduct(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    console.error("Update product error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
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
      return NextResponse.json({ error: "Product id is required" }, { status: 400 });
    }

    const deleted = deleteProduct(id);
    if (!deleted) {
      return NextResponse.json({ error: "Product not found or already deleted" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Product ${id} deleted` });
  } catch (err) {
    console.error("Delete product error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
