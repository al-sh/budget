import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UI_ROUTES } from '../../../constants/urls';
import { HomeIcon } from './icons/Home';
import { PlusIcon } from './icons/Plus';
import { SettingsIcon } from './icons/Settings';
import { StatIcon } from './icons/StatIcon';
import { TransactionsIcon } from './icons/Transactions';
import { Navbar } from './Navbar';

const MenuItem: React.FC<{ Icon: React.FC<{ active?: boolean }>; title: string; to: string }> = ({ to, title, Icon }) => {
  const location = useLocation();

  const isActive = location.pathname.includes(to);

  return (
    <Link to={to}>
      <Navbar.Item active={isActive}>
        {Icon && (
          <Navbar.Icon>
            <Icon active={isActive} />
          </Navbar.Icon>
        )}
        {title}
      </Navbar.Item>
    </Link>
  );
};

export const MainMenu = () => {
  return (
    <Navbar.Wrapper>
      <Navbar.Items>
        <MenuItem to={UI_ROUTES.HOME} title="Обзор" Icon={HomeIcon} />
        <MenuItem to={UI_ROUTES.STATISTICS} title="Статистика" Icon={StatIcon} />
        <MenuItem to={`${UI_ROUTES.TRANSACTIONS}/new`} title="" Icon={PlusIcon} />
        <MenuItem to={UI_ROUTES.TRANSACTIONS} title="Транзакции" Icon={TransactionsIcon} />
        <MenuItem to={UI_ROUTES.SETTINGS.ROOT} title="Настройки" Icon={SettingsIcon} />
      </Navbar.Items>
    </Navbar.Wrapper>
  );
};
