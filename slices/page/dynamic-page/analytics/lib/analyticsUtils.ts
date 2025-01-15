export const calculateGrowth = (current: number, previous: number): string => {
  const growth = ((current - previous) / previous) * 100
  return `${growth.toFixed(2)}%`
}

