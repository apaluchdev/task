import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRemainingTime(futureDate: Date | undefined): { days: number; hours: number; minutes: number } {
  if (!futureDate) {
    return { days: 0, hours: 0, minutes: 0 };
  }

  const future = futureDate.getTime();
  const now = new Date().getTime();
  const difference = future - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0 };
  }

  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
  };
}
