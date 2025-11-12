import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("avatar") as File;
    if (!file) return NextResponse.json({ ok: false, error: "No file uploaded" }, { status: 400 });

    // Validate file type and size
    const allowedMimes = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!allowedMimes.has(file.type)) {
      return NextResponse.json({ ok: false, error: "Unsupported file type" }, { status: 400 });
    }
    if (file.size > maxSize) {
      return NextResponse.json({ ok: false, error: "File too large (max 5MB)" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name || "").toLowerCase() || ".png";
    const fileName = `avatar-${Date.now()}${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadsDir, fileName);

    await mkdir(uploadsDir, { recursive: true });

    await writeFile(filePath, buffer);

    const avatarUrl = `/uploads/${fileName}`;
    await prisma.user.update({
      where: { id: session.user.id as string },
      data: { image: avatarUrl },
    });

    return NextResponse.json({ ok: true, image: avatarUrl });
  } catch (err) {
    console.error("Avatar upload error", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
