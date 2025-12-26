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

    socket.on("show-action", handler);

    return () => {
      socket.off("show-action", handler);
    };
  }, [socket]);
}
