import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 } from "uuid";

export function uuid() {
  return v4();
}

export function getVersion() {
  return "0.0.1";
}

export function isProduction() {
  return !import.meta.env.DEV;
}

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
