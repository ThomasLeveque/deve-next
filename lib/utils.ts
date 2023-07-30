import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function arrayToSingle<T>(value: T | T[] | null | undefined) {
  if (!Array.isArray(value)) {
    return value;
  }
  return null;
}

export function singleToArray<T>(value: T | T[] | null | undefined) {
  if (Array.isArray(value)) {
    return value;
  }
  return [];
}
