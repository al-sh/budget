import React from 'react';
import { Link } from 'react-router-dom';
import { UI_ROUTES } from '../../constants/urls';

const SettingsPage: React.FC = () => {
  return (
    <>
      <h2>Настройки</h2>

      <Link to={UI_ROUTES.SETTINGS.LOGIN}>
        <div>Логин</div>
      </Link>
      <Link to={UI_ROUTES.SETTINGS.CATEGORIES}>
        <div>Категории</div>
      </Link>
    </>
  );
};

export default SettingsPage;
