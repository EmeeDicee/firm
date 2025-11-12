import type { Server } from "socket.io";

export function getIO(): Server | null {
  const g = globalThis as { __io?: Server };
  return g.__io ?? null;
}

export function emitToThread(threadId: string, event: string, payload: unknown) {
  const io = getIO();
  if (!io) return;
  io.to(`thread:${threadId}`).emit(event, payload);
}

export function emitToUser(userId: string, event: string, payload: unknown) {
  const io = getIO();
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
}