import React from 'react';
import { HomeOutlined, PlusCircleOutlined, SettingOutlined, ShoppingOutlined, WalletOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import styled from 'styled-components';

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
        <MenuItem to="/home" title="Обзор" icon={<HomeOutlined />} />
        <MenuItem to="/accounts" title="Счета" icon={<WalletOutlined />} />
        <MenuItem
          to="/transactions/new"
          title=""
          icon={
            <BigSvgWrapper>
              <PlusCircleOutlined />
            </BigSvgWrapper>
          }
        />
        <MenuItem to="/transactions" title="Транзакции" icon={<ShoppingOutlined />} />
        <MenuItem to="/login" title="Меню" icon={<SettingOutlined />} />
      </Navbar.Items>
    </Navbar.Wrapper>
  );
};
