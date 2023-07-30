import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...args: clsx.ClassArray) {
  return twMerge(clsx(args));
}
