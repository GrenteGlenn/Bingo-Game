export type ShowMessage =
  | { type: "number"; value: number; ts: number }
  | { type: "reset-bingo"; ts: number }
  | { type: "palier"; level: 1 | 2 | 3; ts: number }
  | { type: "felicitation"; ts: number }
  | { type: "cagnotte-update"; points: number; ts: number };

