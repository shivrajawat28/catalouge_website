import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function GET() {
  try {
    const pdfPath = path.join(process.cwd(), "public/catalogue/advaita-tattva-catalogue.pdf");
    const coverPath = path.join(process.cwd(), "public/catalogue/catalogue-cover.jpg");

    const pdfExists = fs.existsSync(pdfPath);
    const pdfStat = pdfExists ? fs.statSync(pdfPath) : null;
    const coverExists = fs.existsSync(coverPath);

    return NextResponse.json(
      {
        available: pdfExists && (pdfStat?.size ?? 0) > 0,
        size: pdfStat?.size ?? 0,
        coverAvailable: coverExists,
        path: "/catalogue/advaita-tattva-catalogue.pdf",
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch {
    return NextResponse.json({ available: false }, { status: 500 });
  }
}
