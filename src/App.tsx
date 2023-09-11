import React, { Suspense } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { MainPage } from './components/main/MainPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Loader } from './components/_shared/Loader';
import { AppWrapper, CSSReset } from './components/_shared/main-layout/wrappers';
import { MainMenu } from './components/_shared/main-layout/MainMenu';
import { ThemeProvider } from 'styled-components';
import { dark } from './components/_shared/themes/dark';
import { getStorage } from './services/Storage';
import { light } from './components/_shared/themes/light';
import { UI_ROUTES } from './constants/urls';

/*if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}*/

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const AccountPage = React.lazy(() => import('./components/accounts/pages/AccountPage'));
const AccountsPage = React.lazy(() => import('./components/accounts/pages/AccountsPage'));

const StatisticsPage = React.lazy(() => import('./components/statistics/StatisticsPage'));

const SettingsPage = React.lazy(() => import('./components/settings/SettingsPage'));
const LoginPage = React.lazy(() => import('./components/settings/LoginPage'));
const CategoriesPage = React.lazy(() => import('./components/settings/categories/pages/CategoriesPage'));
const SyncPage = React.lazy(() => import('./components/settings/SyncPage'));
const CategoryDetailsPage = React.lazy(() => import('./components/settings/categories/pages/CategoryDetailsPage'));

const TransactionPage = React.lazy(() => import('./components/transactions/pages/TransactionPage'));
const TransactionsPage = React.lazy(() => import('./components/transactions/pages/TransactionsPage'));

export const App = () => {
  const storage = getStorage();
  const isDarkTheme = storage.getItem('settings.theme') === 'dark';

  console.log('APP START, version:', __APP_VERSION__, 'homepage:', __HOMEPAGE__);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={isDarkTheme ? dark : light}>
          <AppWrapper>
            <CSSReset />
            <MainMenu />
            <main style={{ padding: '1em' }}>
              <Suspense fallback={<Loader size="large" />}>
                <Routes>
                  <Route path={UI_ROUTES.HOME} element={<MainPage />} />
                  <Route path={UI_ROUTES.SETTINGS.ACCOUNTS} element={<AccountsPage />} />
                  <Route path={`${UI_ROUTES.SETTINGS.ACCOUNTS}/:accountId`} element={<AccountPage />} />
                  <Route path={UI_ROUTES.SETTINGS.ROOT} element={<SettingsPage />} />
                  <Route path={UI_ROUTES.SETTINGS.CATEGORIES} element={<CategoriesPage />} />
                  <Route path={UI_ROUTES.SETTINGS.SYNC} element={<SyncPage />} />
                  <Route path={UI_ROUTES.STATISTICS} element={<StatisticsPage />} />
                  <Route path={`${UI_ROUTES.SETTINGS.CATEGORIES}/:categoryId`} element={<CategoryDetailsPage />} />
                  <Route path={UI_ROUTES.SETTINGS.LOGIN} element={<LoginPage />} />
                  <Route path={UI_ROUTES.TRANSACTIONS} element={<TransactionsPage />} />
                  <Route path={`${UI_ROUTES.TRANSACTIONS}/:transactionId`} element={<TransactionPage />} />
                </Routes>
              </Suspense>
            </main>
          </AppWrapper>
        </ThemeProvider>
      </BrowserRouter>
      <div>
        <ReactQueryDevtools
          initialIsOpen
          position="bottom-right"
          panelProps={{ style: { height: '100vh', maxHeight: 'unset', top: 0, width: '50%' } }}
        />
      </div>
    </QueryClientProvider>
  );
};
