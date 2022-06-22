import { Button } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { UI_ROUTES } from '../../constants/urls';
import { useAccounts } from '../../hooks/useAccounts';
import { Loader } from '../_shared/Loader';
import { AccountIcon } from './icons/AccountIcon';

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
  font-size: 1.2em;
`;

export const AccountsList: React.VFC<{ fromMainPage?: boolean }> = ({ fromMainPage }) => {
  const { useGetAccountsList } = useAccounts();
  const [showHidden, setShowHidden] = useState(false);
  const { isLoading, isError, data: accounts } = useGetAccountsList(showHidden);
  const navigate = useNavigate();

  if (isLoading) return <Loader />;
  if (isError) return <>Error</>;

  return (
    <AccountListWrapper>
      {accounts?.map((acc) => (
        <AccountWrapper
          key={acc.id}
          onClick={() => {
            navigate(`${UI_ROUTES.ACCOUNTS}/${acc.id}`);
          }}
        >
          <AccountName active={acc.isActive}>
            <AccountIcon icon={acc.icon} />
            {acc.name}
          </AccountName>
          <AccountRest>{acc.rest} RUB</AccountRest>
        </AccountWrapper>
      ))}
      {!fromMainPage && !showHidden && (
        <Button
          onClick={() => {
            setShowHidden(true);
          }}
        >
          Показать скрытые
        </Button>
      )}
    </AccountListWrapper>
  );
};
