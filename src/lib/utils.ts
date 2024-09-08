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
export const getColorHexCode = (theme: string): string => {
  switch (theme.toUpperCase()) {
    case "GREEN":
      return "#277C78";
    case "YELLOW":
      return "#F2CDAC";
    case "CYAN":
      return "#82C9D7";
    case "NAVY":
      return "#626070";
    case "RED":
      return "#C94736";
    case "PURPLE":
      return "#826CB0";
    case "TURQUOISE":
      return "#597C7C";
    case "BROWN":
      return "#93674F";
    case "MAGENTA":
      return "#934F6F";
    case "BLUE":
      return "#3F82B2";
    case "GREY":
      return "#696868";
    case "ARMY":
      return "#7F9161";
    case "PINK":
      return "#AF81BA";
    case "YELLOWGREEN":
      return "#CAB361";
    case "ORANGE":
      return "#BE6C49";
    default:
      return "#000000";
  }
};
export const logoMapping: Record<string, string> = {
  Entertainment: "/images/Logo-5.jpg",
  Bills: "/images/Logo-3.jpg",
  Groceries: "/images/Logo-1.jpg",
  "Dining Out": "/images/Logo-2.jpg",
  Transportation: "/images/Logo-4.jpg",
  "Personal Care": "/images/Logo-2.jpg",
  Education: "/images/Logo-3.jpg",
  Lifestyle: "/images/Logo-5.jpg",
  Shopping: "/images/Logo-6.jpg",
  General: "/images/Logo-8.jpg",
};
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
