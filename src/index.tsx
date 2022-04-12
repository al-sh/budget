import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { MainPage } from './components/main/MainPage';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Loader } from './components/_shared/Loader';
import { Menu } from 'antd';
import { HomeOutlined, ShoppingOutlined, WalletOutlined } from '@ant-design/icons';

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

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div>
          <Menu mode="horizontal">
            <Menu.Item key="main" icon={<HomeOutlined />}>
              <Link to="/">
                <span>Обзор</span>
              </Link>
            </Menu.Item>

            <Menu.Item key="accounts" icon={<WalletOutlined />}>
              <Link to="/accounts">
                <span>Счета</span>
              </Link>
            </Menu.Item>

            <Menu.Item key="transactions" icon={<ShoppingOutlined />}>
              <Link to="/transactions">
                <span>Транзакции</span>
              </Link>
            </Menu.Item>

            <Menu.Item key="login">
              <Link to="/login">
                <span>Авторизация</span>
              </Link>
            </Menu.Item>
          </Menu>
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
        </div>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen panelProps={{ style: { height: '100vh', maxHeight: 'unset', top: 0, width: '50%' } }} />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
