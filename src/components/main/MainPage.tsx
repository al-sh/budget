import { Switch } from 'antd';
import { getStorage } from '../../services/Storage';

export const MainPage = () => {
  const storage = getStorage();
  const isDark = storage.getItem('settings.theme') === 'dark';

  return (
    <div>
      <h1>Main page</h1>
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
    </div>
  );
};
