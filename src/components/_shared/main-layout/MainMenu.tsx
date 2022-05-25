import React from 'react';
import { HomeOutlined, PlusCircleOutlined, SettingOutlined, ShoppingOutlined, WalletOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import styled from 'styled-components';
import { UI_ROUTES } from '../../../constants/urls';

const MenuItem: React.FC<{ icon: React.ReactElement; title: string; to: string }> = ({ to, title, icon }) => {
  const location = useLocation();

  return (
    <Link to={to}>
      <Navbar.Item active={location.pathname.includes(to)}>
        {icon && <Navbar.Icon>{icon}</Navbar.Icon>}
        {title}
      </Navbar.Item>
    </Link>
  );
};

const BigSvgWrapper = styled.span`
  svg {
    height: 4rem;
    width: 4rem;
  }
`;

export const MainMenu = () => {
  return (
    <Navbar.Wrapper>
      <Navbar.Items>
        <MenuItem to={UI_ROUTES.HOME} title="Обзор" icon={<HomeOutlined />} />
        <MenuItem to={UI_ROUTES.ACCOUNTS} title="Счета" icon={<WalletOutlined />} />
        <MenuItem
          to={`${UI_ROUTES.TRANSACTIONS}/new`}
          title=""
          icon={
            <BigSvgWrapper>
              <PlusCircleOutlined />
            </BigSvgWrapper>
          }
        />
        <MenuItem to={UI_ROUTES.TRANSACTIONS} title="Транзакции" icon={<ShoppingOutlined />} />
        <MenuItem to={UI_ROUTES.SETTINGS.ROOT} title="Настройки" icon={<SettingOutlined />} />
      </Navbar.Items>
    </Navbar.Wrapper>
  );
};
