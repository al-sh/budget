import { useNavigate } from 'react-router-dom';
import { useAccounts } from '../../hooks/useAccounts';
import { Loader } from '../_shared/Loader';
import styled from 'styled-components';

const AccountName = styled.span<{ active: boolean }>`
  color: ${({ theme, active }) => (active ? theme.text.primary : theme.text.inactive)};
`;

export const AccountsList: React.VFC = () => {
  const { useGetList } = useAccounts();
  const { isFetching, isError, data: accounts } = useGetList();
  const navigate = useNavigate();

  if (isFetching) return <Loader />;
  if (isError) return <>Error</>;

  return (
    <>
      {accounts.map((acc) => (
        <div key={acc.id}>
          <AccountName
            onClick={() => {
              navigate(`/accounts/${acc.id}`);
            }}
            active={acc.isActive}
          >
            {acc.name}
          </AccountName>
        </div>
      ))}
    </>
  );
};
