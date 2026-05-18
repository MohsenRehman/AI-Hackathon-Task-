export const formatCurrency = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount ?? 0);

export const formatNumber = (num) =>
  new Intl.NumberFormat('en-US').format(num ?? 0);
