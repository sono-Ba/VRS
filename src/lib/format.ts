const currencyFormatter = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-AE");

export function formatPrice(value: number | undefined): string {
  if (value === undefined) return "Price on request";
  return currencyFormatter.format(value);
}

export function formatArea(value: number | undefined): string {
  if (value === undefined) return "—";
  return `${numberFormatter.format(value)} m²`;
}

export function formatPricePerArea(
  price: number | undefined,
  area: number | undefined
): string {
  if (price === undefined || !area) return "—";
  return `${currencyFormatter.format(Math.round(price / area))} / m²`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
