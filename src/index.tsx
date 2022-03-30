import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import { LoginPage } from './components/login/LoginPage';
import { AccountsPage } from './components/accounts/AccountsPage';
import { QueryClient, QueryClientProvider } from 'react-query';
import { TransactionsPage } from './components/transactions/TransactionsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div>
          <menu>
            <Link to="/">
              <div>Главная</div>
            </Link>
            <Link to="/login">
              <div>Авторизация</div>
            </Link>
            <Link to="/accounts">
              <div>Счета</div>
            </Link>
            <Link to="/transactions">
              <div>Транзакции</div>
            </Link>
          </menu>
          <main>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="accounts" element={<AccountsPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
            </Routes>
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
