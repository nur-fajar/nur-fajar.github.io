import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Gabung nama kelas dengan benar: kondisional lewat clsx, konflik
 *  utilitas Tailwind diratakan lewat tailwind-merge (pola shadcn/ui). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
