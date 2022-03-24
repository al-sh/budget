import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_PASSWORD_ENDPOINT } from '../../constants/urls';
import { useApi } from '../../services/Api';
import { useStorage } from '../../services/Storage';

export const LoginPage: React.FC = () => {
  const api = useApi();
  const storage = useStorage();
  const navigate = useNavigate();

  const nameInput = useRef(null);
  const passwordInput = useRef(null);

  return (
    <>
      <h2>Login</h2>
      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            console.log(nameInput.current.value, passwordInput.current.value);
            const response = await api.send<{ token: string }>({
              data: {
                login: nameInput.current.value,
                password: passwordInput.current.value,
              },
              endpoint: AUTH_PASSWORD_ENDPOINT,
              method: 'POST',
            });
            console.log('response: ', response);
            storage.setItem('token', response.data.token);
            navigate('/main');
          }}
        >
          <input type="text" ref={nameInput} placeholder="Введите логин" />
          <input type="text" ref={passwordInput} placeholder="Введите пароль" />
          <button type="submit">Создать</button>
        </form>
      </div>
    </>
  );
};
