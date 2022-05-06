/* eslint-disable sort-keys */
const formatter = new Intl.NumberFormat('ru-RU', {
  currency: 'RUR',
  style: 'currency',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatMoney = formatter.format;
