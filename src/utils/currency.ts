export type Currency = 'USD' | 'INR';

// USD to INR standard conversion rate
export const USD_TO_INR_RATE = 87.0;

export function formatPrice(
  val: number,
  targetCurrency: Currency,
  baseCurrency: Currency = 'USD'
): string {
  let displayVal = val;

  if (baseCurrency === 'USD' && targetCurrency === 'INR') {
    displayVal = val * USD_TO_INR_RATE;
  } else if (baseCurrency === 'INR' && targetCurrency === 'USD') {
    displayVal = val / USD_TO_INR_RATE;
  }

  if (targetCurrency === 'INR') {
    return `₹${displayVal.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `$${displayVal.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
