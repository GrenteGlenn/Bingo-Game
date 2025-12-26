"use client";

import { getSocket } from "./socket";
import { ShowMessage } from "./show";

type Listener = (m: ShowMessage) => void;

export function subscribe(cb: Listener) {
  const socket = getSocket();

  socket.on("show-action", cb);

  return () => {
    socket.off("show-action", cb);
  };
}
