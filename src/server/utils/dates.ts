import { isValid, parse, format } from 'date-fns';
import { FindOptionsWhere, Raw } from 'typeorm';
import { formats } from '../../constants/formats';
import { Transaction } from '../entity/Transaction';

export const buildPeriodFilterString = (dtFrom?: string, dtEnd?: string) => {
  let result: FindOptionsWhere<Transaction>['dt'];

  if (dtFrom && !dtEnd) {
    if (isValid(parse(dtFrom, formats.date.short, new Date()))) {
      result = Raw((alias) => `${alias} >= :dtFrom`, { dtFrom: dtFrom });
    } else {
      console.error('transactions getAll invalid dtFrom', dtFrom);
    }
  }

  if (!dtFrom && dtEnd) {
    if (isValid(parse(dtEnd, formats.date.short, new Date()))) {
      const dtEndValue = parse(dtEnd, formats.date.short, new Date());
      dtEndValue.setDate(dtEndValue.getDate() + 1);
      const dtEndToFilter = format(dtEndValue, formats.date.short);

      result = Raw((alias) => `${alias} <= :dtEnd`, { dtEnd: dtEndToFilter });
    } else {
      console.error('transactions getAll invalid dtEnd', dtEnd);
    }
  }

  if (dtFrom && dtEnd) {
    if (isValid(parse(dtFrom, formats.date.short, new Date())) && isValid(parse(dtEnd, formats.date.short, new Date()))) {
      const dtEndValue = parse(dtEnd, formats.date.short, new Date());
      dtEndValue.setDate(dtEndValue.getDate() + 1);
      const dtEndToFilter = format(dtEndValue, formats.date.short);

      result = Raw((alias) => `${alias} >= :dtFrom AND ${alias} <= :dtEnd`, { dtFrom: dtFrom, dtEnd: dtEndToFilter });
    } else {
      console.error('transactions getAll invalid dtFrom or dtEnd', dtFrom, dtEnd);
    }
  }

  return result;
};
