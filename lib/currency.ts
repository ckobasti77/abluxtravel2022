/**
 * Safely format price with any currency code (ISO 4217, Cyrillic like "ДИН", "РСД", "ЕУР", or custom strings).
 * Prevents RangeError: Invalid currency code in Intl.NumberFormat.
 */
export function formatPrice(
  price: number,
  currency: string | undefined | null,
  locale = "sr-RS",
  options?: { maximumFractionDigits?: number; minimumFractionDigits?: number }
): string {
  const rawCurrency = (currency ?? "").trim() || "EUR";
  const maxDigits = options?.maximumFractionDigits ?? 0;
  const minDigits = options?.minimumFractionDigits;

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: rawCurrency.toUpperCase(),
      maximumFractionDigits: maxDigits,
      minimumFractionDigits: minDigits,
    }).format(price);
  } catch {
    const formattedNumber = new Intl.NumberFormat(locale, {
      maximumFractionDigits: maxDigits,
      minimumFractionDigits: minDigits,
    }).format(price);
    return `${formattedNumber} ${rawCurrency}`;
  }
}
