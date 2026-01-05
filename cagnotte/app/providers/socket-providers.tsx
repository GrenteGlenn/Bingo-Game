"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null);

  if (!socketRef.current) {
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      path: "/socket.io",
      transports: ["websocket"], // ❌ retire polling
      reconnection: true,
      reconnectionAttempts: Infinity,
    });

    socketRef.current.on("connect", () => {
      console.log("✅ socket global connecté", socketRef.current?.id);
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
