import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error: any): string {
  if (error.response && error.response.data) {
    const data = error.response.data;
    // Handle non_field_errors from DRF
    if (data.non_field_errors) {
      return data.non_field_errors.join(' ');
    }
    // Handle field errors
    if (typeof data === 'object') {
      const fieldErrors = Object.entries(data).map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: ${value.join(' ')}`;
        }
        return `${key}: ${String(value)}`;
      });
      if (fieldErrors.length > 0) {
        return fieldErrors.join('; ');
      }
    }
  }
  return error.message || "Ocurrió un error inesperado.";
}