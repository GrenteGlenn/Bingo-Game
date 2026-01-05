"use client";

import { useEffect, useRef } from "react";
import { ShowMessage } from "./show";
import { useSocket } from "@/app/providers/socket-providers";

type Listener = (m: ShowMessage) => void;

export function useShowChannel(cb: Listener) {
  const socket = useSocket();
  const cbRef = useRef(cb);

  // toujours garder la dernière version du callback
  cbRef.current = cb;

  useEffect(() => {
    const handler = (m: ShowMessage) => {
      cbRef.current(m);
    };

    const handleConnect = () => {
      console.log("📡 Display connecté → resync");
      socket.emit("request-full-state");
    };

    socket.on("show-action", handler);
    socket.on("connect", handleConnect);

    // si déjà connecté (reload)
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("show-action", handler);
      socket.off("connect", handleConnect);
    };
  }, [socket]);
}
