import { useNavigate } from 'react-router-dom';
import { useAccounts } from '../../hooks/useAccounts';

export const AccountsList: React.VFC = () => {
  const { useGetList, useDelete } = useAccounts();
  const { isLoading, isError, data: accounts } = useGetList();
  const deleteAccountMutation = useDelete();
  const navigate = useNavigate();

  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error</>;

  return (
    <>
      {accounts.map((acc) => (
        <div key={acc.id}>
          <span
            onClick={() => {
              navigate(`/accounts/${acc.id}`);
            }}
          >
            Название: {acc.name}
          </span>
          <span style={{ marginLeft: 10 }}>Активен: {acc.isActive ? 'Да' : 'Нет'}</span>
          <button
            onClick={() => {
              deleteAccountMutation.mutate(acc.id);
            }}
          >
            Удалить
          </button>
        </div>
      ))}
    </>
  );
};
