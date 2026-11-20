import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { getAllCategories, addCategory, deleteCategory } from "@/lib/catalogStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = getAllCategories();
    return NextResponse.json({ success: true, categories });
  } catch (err) {
    console.error("Get categories error:", err);
    return NextResponse.json({ error: "Failed to retrieve categories" }, { status: 500 });
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
    const { id, label, description } = body;

    if (!label) {
      return NextResponse.json({ error: "Category label/name is required" }, { status: 400 });
    }

    const generatedId =
      id ||
      label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-");

    const saved = addCategory({
      id: generatedId,
      label,
      description,
    });

    return NextResponse.json({ success: true, category: saved }, { status: 201 });
  } catch (err) {
    console.error("Add category error:", err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
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
      return NextResponse.json({ error: "Category id is required" }, { status: 400 });
    }

    if (id === "buddha" || id === "hindu") {
      return NextResponse.json(
        { error: "Default categories cannot be deleted" },
        { status: 400 }
      );
    }

    const deleted = deleteCategory(id);
    if (!deleted) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Category ${id} deleted` });
  } catch (err) {
    console.error("Delete category error:", err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
