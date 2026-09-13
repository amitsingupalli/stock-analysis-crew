export type Currency = 'USD' | 'INR';

// USD to INR standard conversion rate
export const USD_TO_INR_RATE = 87.0;

export function formatPrice(valInUSD: number, currency: Currency): string {
  if (currency === 'INR') {
    const inrVal = valInUSD * USD_TO_INR_RATE;
    return `₹${inrVal.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `$${valInUSD.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
