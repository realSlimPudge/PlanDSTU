import { AuthType } from "../Types/types";

const host = process.env.HOST;

export const authFetcher = async (url: string, payload: AuthType) => {
  const res = await fetch(`${host}/${url}`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Произошла ошибка");
};
