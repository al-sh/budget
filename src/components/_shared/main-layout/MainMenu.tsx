import React from 'react';
import { HomeOutlined, SettingOutlined, ShoppingOutlined, WalletOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';

const MenuItem: React.FC<{ icon: React.ReactElement; title: string; to: string }> = ({ to, title, icon }) => {
  const location = useLocation();
  console.log(location);

  return (
    <Link to={to}>
      <Navbar.Item active={location.pathname === to}>
        {icon && <Navbar.Icon>{icon}</Navbar.Icon>}
        {title}
      </Navbar.Item>
    </Link>
  );
};

export const MainMenu = () => {
  return (
    <Navbar.Wrapper>
      <Navbar.Items>
        <MenuItem to="/" title="Обзор" icon={<HomeOutlined />} />
        <MenuItem to="/accounts" title="Счета" icon={<WalletOutlined />} />
        <MenuItem to="/transactions" title="Транзакции" icon={<ShoppingOutlined />} />
        <MenuItem to="/login" title="Авторизация" icon={<SettingOutlined />} />
      </Navbar.Items>
    </Navbar.Wrapper>
  );
};
