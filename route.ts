import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(email?: string | null) {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  return !!adminEmail && !!email && email.toLowerCase() === adminEmail;
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const status = String(body?.status || "").toUpperCase();
  if (!["APPROVED", "REJECTED", "CANCELLED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await prisma.withdrawal.update({
    where: { id: params.id },
    data: { status: status as "APPROVED" | "REJECTED" | "CANCELLED" },
    select: { id: true, userId: true, amountUSD: true, status: true },
  }).catch(() => null);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Create notification for user and emit realtime
  const notif = await prisma.notificationsBell.create({
    data: {
      userId: updated.userId,
      title: `Withdrawal ${status}`,
      message: `Your withdrawal of $${updated.amountUSD} is ${status.toLowerCase()}.`,
    },
  }).catch(() => null);
  try {
    const { emitToUser } = await import("@/lib/socketIo");
    if (notif) emitToUser(updated.userId, "notification:new", notif);
  } catch {}

  return NextResponse.json({ ok: true, withdrawal: updated });
}