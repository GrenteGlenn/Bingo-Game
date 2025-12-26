"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      path: "/socket.io",
      transports: ["polling", "websocket"],
    });
    socket.on("connect", () => {
      console.log("✅ socket connecté", socket?.id);
    });
  }

  return socket;
}
