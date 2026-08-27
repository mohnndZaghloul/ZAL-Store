export function getEffectivePrice(
  price: number,
  discountPercent?: number | null,
): number {
  if (!discountPercent || discountPercent <= 0) return price;
  const clamped = Math.min(discountPercent, 100);
  return Math.round(price * (1 - clamped / 100) * 100) / 100;
}

export function isOnSale(discountPercent?: number | null): boolean {
  return !!discountPercent && discountPercent > 0;
}
