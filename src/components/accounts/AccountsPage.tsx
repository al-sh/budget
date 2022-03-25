import React, { useCallback, useMemo, useRef } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useApi } from '../../services/Api';
import { Account } from '../../server/entity/Account';

export const AccountsPage: React.FC = () => {
  const api = useApi();
  const queryKey = useMemo(() => ['accounts'], []);
  const { isLoading, isError, data } = useQuery(queryKey, () => api.send<Account[]>({ endpoint: 'accounts', method: 'GET' }));

  const nameInput = useRef(null);
  const isActiveInput = useRef(null);
  const queryClient = useQueryClient();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      console.log(nameInput.current.value, isActiveInput.current.checked);
      await api.send({
        data: {
          isActive: isActiveInput.current.checked,
          name: nameInput.current.value,
        },
        endpoint: 'accounts',
        method: 'POST',
      });
      queryClient.invalidateQueries(queryKey);
      nameInput.current.value = '';
      isActiveInput.current.checked = true;
    },
    [api, queryClient, queryKey]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      await api.send({
        data: {
          id: id,
        },
        endpoint: 'accounts',
        method: 'DELETE',
      });
      queryClient.invalidateQueries(queryKey);
    },
    [api, queryClient, queryKey]
  );

  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error</>;

  return (
    <>
      <div>Accounts</div>
      {data.data.map((acc) => (
        <div key={acc.id}>
          <span>Название: {acc.name}</span>
          <span style={{ marginLeft: 10 }}>Активен: {acc.isActive ? 'Да' : 'Нет'}</span>
          <button
            onClick={() => {
              handleDelete(acc.id);
            }}
          >
            Delete
          </button>
        </div>
      ))}

      <div>Add new account</div>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" ref={nameInput} placeholder="Введите название" />
          <input type="checkbox" ref={isActiveInput} title="Активен" />
          <button type="submit">Создать</button>
        </form>
      </div>
    </>
  );
};
