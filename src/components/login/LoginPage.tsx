import { notification } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_PASSWORD_ENDPOINT } from '../../constants/urls';
import { AuthResponse } from '../../server/routes/auth';
import { useApi } from '../../services/Api';
import { useStorage } from '../../services/Storage';

export const LoginPage: React.FC = () => {
  const api = useApi();
  const storage = useStorage();
  const navigate = useNavigate();

  const nameInput = useRef(null);
  const passwordInput = useRef(null);

  useEffect(() => {
    nameInput.current.value = 'demo';
    passwordInput.current.value = 'demo';
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(nameInput.current.value, passwordInput.current.value);
      try {
        const response = await api.send<AuthResponse>({
          data: {
            login: nameInput.current.value,
            password: passwordInput.current.value,
          },
          endpoint: AUTH_PASSWORD_ENDPOINT,
          method: 'POST',
        });
        console.log('response: ', response);
        storage.setItem('token', response.data.token);
        storage.setItem('userId', String(response.data.userId));
        navigate('/main');
      } catch (e) {
        if (e.response?.status === 403) {
          notification.error({ message: 'Неправильный логин/пароль' });
        } else {
          notification.error({ message: 'Произошла ошибка авторизации. Повторите попытку позже.' });
        }
      }
    },
    [api, navigate, storage]
  );

  return (
    <>
      <h2>Login</h2>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" ref={nameInput} placeholder="Введите логин" />
          <input type="text" ref={passwordInput} placeholder="Введите пароль" />
          <button type="submit">Создать</button>
        </form>
      </div>
    </>
  );
};
