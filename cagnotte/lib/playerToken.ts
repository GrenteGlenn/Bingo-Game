export function getPlayerToken() {
  if (typeof window === "undefined") return "";

  let token = sessionStorage.getItem("bingo-token");

  if (!token) {
    token = crypto.randomUUID();
    sessionStorage.setItem("bingo-token", token);
  }

  return token;
}
