/* eslint-disable sort-exports/sort-exports */
export const homepage = 'budget';

export const publicUrl = location?.origin + '/' + homepage;

const uiRoot = '/' + homepage;

export const UI_ROUTES = {
  HOME: `${uiRoot}/home`,
  SETTINGS: {
    ROOT: `${uiRoot}/settings`,
    ACCOUNTS: `${uiRoot}/accounts`,
    CATEGORIES: `${uiRoot}/settings/categories`,
    LOGIN: `${uiRoot}/settings/login`,
  },
  STATISTICS: `${uiRoot}/statistics`,
  TRANSACTIONS: `${uiRoot}/transactions`,
};
