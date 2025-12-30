export function getPlayerToken(): string {
  if (typeof window === "undefined") return "";

  let token = localStorage.getItem("bingo-token");

  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem("bingo-token", token);
  }

  return token;
}
