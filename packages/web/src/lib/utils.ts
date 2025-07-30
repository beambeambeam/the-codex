import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFallbackUsername(username: string): string {
  if (!username || typeof username !== "string") return "user";
  const parts = username.split(" ");
  return parts.map((item) => item[0]).join("");
}
