
export type ShowMessage =
  | { type: "number"; value: number; ts: number }
  | { type: "reset-bingo"; ts: number }
  | { type: "palier"; level: 1 | 2 | 3; ts: number }
  | { type: "felicitation"; ts: number };

const CHANNEL_NAME = "rte-show-channel";
const STORAGE_KEY = "rte-show-last-message";

export function postMessage(msg: { type: "number"; value: number }): void;
export function postMessage(msg: { type: "reset-bingo" }): void;
export function postMessage(msg: { type: "palier"; level: 1 | 2 | 3 }): void;
export function postMessage(msg: { type: "felicitation" }): void;


export function postMessage(
  msg:
    | { type: "number"; value: number }
    | { type: "reset-bingo" }
    | { type: "palier"; level: 1 | 2 | 3 }
    | { type: "felicitation" }
) {
  const full: ShowMessage = {
    ...msg,
    ts: Date.now(),
  };

  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    const bc = new BroadcastChannel(CHANNEL_NAME);
    bc.postMessage(full);
    bc.close();
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
  } catch {}
}

export function subscribe(onMsg: (m: ShowMessage) => void) {
  if (typeof window === "undefined") return () => {};

  let bc: BroadcastChannel | null = null;

  if ("BroadcastChannel" in window) {
    bc = new BroadcastChannel(CHANNEL_NAME);
    bc.onmessage = (e) => onMsg(e.data as ShowMessage);
  }

  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY || !e.newValue) return;
    try {
      onMsg(JSON.parse(e.newValue) as ShowMessage);
    } catch {}
  };

  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener("storage", onStorage);
    if (bc) bc.close();
  };
}
