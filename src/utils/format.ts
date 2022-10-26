/* eslint-disable sort-keys */
import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import { parseISO } from 'date-fns';

export const formatDate = (dt?: Date) => {
  if (!dt) {
    return '';
  }
  const newDt = parseISO(dt as unknown as string);
  if (!isValid(newDt)) {
    console.log('invalid date: ', newDt);
    return '';
  }
  return format(newDt, 'HH:mm dd.MM.yyyy');
};

export const formatDateShort = (dt?: Date) => {
  if (!dt) {
    return '';
  }
  const newDt = parseISO(dt as unknown as string);
  if (!isValid(newDt)) {
    console.log('invalid date: ', newDt);
    return '';
  }
  return format(newDt, 'dd.MM.yyyy');
};

const formatter = new Intl.NumberFormat('ru-RU', {
  currency: 'RUR',
  style: 'currency',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatMoney = (value: number) => formatter.format(value / 100);

const percentFormatter = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatPercent = percentFormatter.format;
