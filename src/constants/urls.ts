/* eslint-disable sort-exports/sort-exports */
export const homepage = 'budget';

export const publicUrl = location?.origin + '/' + homepage;

const uiRoot = '/' + homepage;

export const UI_ROUTES = {
  ACCOUNTS: `${uiRoot}/accounts`,
  HOME: `${uiRoot}/home`,
  SETTINGS: {
    ROOT: `${uiRoot}/settings`,
    CATEGORIES: `${uiRoot}/settings/categories`,
    LOGIN: `${uiRoot}/settings/login`,
  },
  TRANSACTIONS: `${uiRoot}/transactions`,
};
