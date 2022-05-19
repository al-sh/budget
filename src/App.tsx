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
import { dark } from './components/_shared/main-layout/themes/dark';
import { getStorage } from './services/Storage';
import { light } from './components/_shared/main-layout/themes/light';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const AccountPage = React.lazy(() => import('./components/accounts/AccountPage'));
const AccountsPage = React.lazy(() => import('./components/accounts/AccountsPage'));
const LoginPage = React.lazy(() => import('./components/login/LoginPage'));
const TransactionsPage = React.lazy(() => import('./components/transactions/TransactionsPage'));

export const App = () => {
  const storage = getStorage();
  const isDarkTheme = storage.getItem('settings.theme') === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={isDarkTheme ? dark : light}>
          <AppWrapper>
            <CSSReset />
            <MainMenu />
            <main style={{ padding: 20, width: 600 }}>
              <Suspense fallback={<Loader size="large" />}>
                <Routes>
                  <Route path="/" element={<MainPage />} />
                  <Route path="accounts" element={<AccountsPage />} />
                  <Route path="accounts/:accountId" element={<AccountPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="transactions" element={<TransactionsPage />} />
                </Routes>
              </Suspense>
            </main>
          </AppWrapper>
        </ThemeProvider>
      </BrowserRouter>
      <ReactQueryDevtools
        initialIsOpen
        position="bottom-right"
        panelProps={{ style: { height: '100vh', maxHeight: 'unset', top: 0, width: '50%' } }}
      />
    </QueryClientProvider>
  );
};
