import { useNavigate } from 'react-router-dom';
import { useAccounts } from '../../hooks/useAccounts';
import { Loader } from '../_shared/Loader';
import styled from 'styled-components';
import { UI_ROUTES } from '../../constants/urls';

const AccountListWrapper = styled.div`
  margin-bottom: 1em;
`;

const AccountName = styled.span<{ active: boolean }>`
  color: ${({ theme, active }) => (active ? theme.text.primary : theme.text.inactive)};
`;

const AccountRest = styled.span``;

const AccountWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid black;
  font-size: 1.5em;
`;

export const AccountsList: React.VFC = () => {
  const { useGetList } = useAccounts();
  const { isFetching, isError, data: accounts } = useGetList();
  const navigate = useNavigate();

  if (isFetching) return <Loader />;
  if (isError) return <>Error</>;

  return (
    <AccountListWrapper>
      {accounts.map((acc) => (
        <AccountWrapper
          key={acc.id}
          onClick={() => {
            navigate(`${UI_ROUTES.ACCOUNTS}/${acc.id}`);
          }}
        >
          <AccountName active={acc.isActive}>img {acc.name}</AccountName>
          <AccountRest>{acc.rest} RUB</AccountRest>
        </AccountWrapper>
      ))}
    </AccountListWrapper>
  );
};
