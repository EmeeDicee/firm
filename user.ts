import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    // ✅ Check session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";
    let name: string | undefined;
    let imageUrl: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      name = (formData.get("name") as string) || undefined;
      const file = formData.get("avatar") as File | null;
      if (file) {
        const allowedMimes = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
        const maxSize = 10 * 1024 * 1024;
        if (!allowedMimes.has(file.type)) return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
        if (file.size > maxSize) return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
        const uploadRes = await uploadImageToCloudinary(file);
        imageUrl = uploadRes.secure_url;
      }
    } else {
      // Fallback to JSON body
      const body = await req.json().catch(() => ({}));
      name = body?.name || undefined;
      imageUrl = body?.avatar || undefined;
    }

    // ✅ Update user in Prisma
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name || undefined,
        image: imageUrl || undefined,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
