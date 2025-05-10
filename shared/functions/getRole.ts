import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  login: string;
  role: string;
  uid: string;
  exp: number;
};

export function getRole() {
  if (typeof window === "undefined") return null;
  try {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) return null;
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.role;
  } catch (e) {
    console.error("Error getting role:", e);
    return null;
  }
}
