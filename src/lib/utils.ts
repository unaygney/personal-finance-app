import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Environment variable ${key} is not defined.`);
  }

  return value;
};
