import {
  AccountBookOutlined,
  ApiOutlined,
  BankOutlined,
  CreditCardOutlined,
  FontColorsOutlined,
  HeartOutlined,
  MobileOutlined,
  ShopOutlined,
  StarOutlined,
  WalletOutlined,
} from '@ant-design/icons';

export const getAccountIcon = (icon?: string) => {
  return icons.find((item) => item.value === icon)?.el || <AccountBookOutlined />;
};

export const icons = [
  { value: 'AccountBookOutlined', el: <AccountBookOutlined /> },
  { value: 'ApiOutlined', el: <ApiOutlined /> },
  { value: 'BankOutlined', el: <BankOutlined /> },
  { value: 'CreditCardOutlined', el: <CreditCardOutlined /> },
  { value: 'FontColorsOutlined', el: <FontColorsOutlined /> },
  { value: 'HeartOutlined', el: <HeartOutlined /> },
  { value: 'MobileOutlined', el: <MobileOutlined /> },
  { value: 'ShopOutlined', el: <ShopOutlined /> },
  { value: 'StarOutlined', el: <StarOutlined /> },
  { value: 'WalletOutlined', el: <WalletOutlined /> },
];
