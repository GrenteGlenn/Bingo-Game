const VERSION = "v2"; // incrémente quand tu changes la logique

export function getPlayerToken() {
  if (typeof window === "undefined") return "";

  let token = localStorage.getItem(`bingo-token-${VERSION}`);

  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(`bingo-token-${VERSION}`, token);
  }

  return token;
}
