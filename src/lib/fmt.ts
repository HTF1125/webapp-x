// lib/utils.ts
export function formatDate(date: string | null): string {
    return date ? new Date(date).toLocaleDateString() : 'N/A'
  }

  export function formatPercentage(value: number | null): string {
    return value !== null ? `${(value * 100).toFixed(2)}%` : 'N/A'
  }
