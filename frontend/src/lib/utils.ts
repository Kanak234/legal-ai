import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PERSONAS = [
  "Advocate",
  "Law Student",
  "Senior Advocate",
  "Judge",
  "Researcher",
  "Police / Investigator",
  "Journalist",
  "Government Officer",
  "Citizen",
  "Legal Startup",
  "Corporate Counsel",
  "University",
  "Legal Aid",
  "Admin"
];
