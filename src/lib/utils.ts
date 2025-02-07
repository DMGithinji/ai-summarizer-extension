import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function areArrayEqual(arr1: string[], arr2: string[]) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false;
  }

  if (arr1.length !== arr2.length) {
    return false;
  }

  // Create frequency maps
  const count = new Map();

  // Count items in first array
  for (const item of arr1) {
    count.set(item, (count.get(item) || 0) + 1);
  }

  // Subtract counts from second array
  for (const item of arr2) {
    const currentCount = count.get(item);
    if (currentCount === undefined) {
      return false;
    }
    if (currentCount === 1) {
      count.delete(item);
    } else {
      count.set(item, currentCount - 1);
    }
  }

  return count.size === 0;
}
