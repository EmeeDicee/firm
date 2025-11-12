import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  // Initialize Socket.IO once and reuse on subsequent calls
  const server = (res.socket as unknown as { server: HttpServer }).server;
  const srvWithIo = server as HttpServer & { io?: Server };
  if (!srvWithIo.io) {
    const io = new Server(server, {
      path: "/api/socket",
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      socket.on("join", (threadId: string) => {
        socket.join(`thread:${threadId}`);
        io.to(`thread:${threadId}`).emit("presence", { online: true });
      });

      // Join user notifications room
      socket.on("joinUser", (userId: string) => {
        if (!userId) return;
        socket.join(`user:${userId}`);
      });

      socket.on("typing", ({ threadId, typing, isAdmin }: { threadId: string; typing: boolean; isAdmin?: boolean }) => {
        io.to(`thread:${threadId}`).emit("typing", { typing, isAdmin: !!isAdmin });
      });

      socket.on("disconnecting", () => {
        const rooms = Array.from(socket.rooms);
        rooms.forEach((room) => {
          if (room.startsWith("thread:")) {
            io.to(room).emit("presence", { online: false });
          }
        });
      });
    });

    srvWithIo.io = io;
    (globalThis as unknown as { __io?: Server }).__io = io;
  }
  res.end();
}