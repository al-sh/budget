import { Switch } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { UI_ROUTES } from '../../constants/urls';
import { getStorage } from '../../services/Storage';

const SettingsPage: React.FC = () => {
  const storage = getStorage();
  const isDark = storage.getItem('settings.theme') === 'dark';

  return (
    <>
      <h2>Настройки</h2>

      <Link to={UI_ROUTES.SETTINGS.LOGIN}>
        <div>Логин</div>
      </Link>
      <Link to={UI_ROUTES.SETTINGS.ACCOUNTS}>
        <div>Счета</div>
      </Link>
      <Link to={UI_ROUTES.SETTINGS.CATEGORIES}>
        <div>Категории</div>
      </Link>
      <Switch
        title="Тема"
        checkedChildren="Темная"
        unCheckedChildren="Светлая"
        defaultChecked={isDark}
        onChange={(val) => {
          storage.setItem('settings.theme', val ? 'dark' : 'light');
          location.reload();
        }}
      />
    </>
  );
};

export default SettingsPage;
