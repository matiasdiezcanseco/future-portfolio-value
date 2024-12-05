import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number | undefined) => {
  if (!value) {
    return '$0.00';
  }

  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};
