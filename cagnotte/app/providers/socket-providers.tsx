"use client";

import { createContext, useContext, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { getPlayerToken } from "@/lib/playerToken";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null);

  if (!socketRef.current) {
    const token = getPlayerToken(); // ✅ toujours dispo côté client

    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token }, // ✅ envoyé AU CONNECT
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
    });

    socketRef.current.on("connect", () => {
      console.log(
        "✅ socket global connecté",
        socketRef.current?.id,
        "token:",
        token
      );
    });
  }

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket(): Socket {
  const socket = useContext(SocketContext);
  if (!socket) throw new Error("useSocket must be used inside SocketProvider");
  return socket;
}
