import { AccountBookOutlined, ApiOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const AccountIconWrapper = styled.span``;

export const AccountIcon: React.VFC<{ icon?: string }> = ({ icon }) => {
  return <AccountIconWrapper>{icon ? <AccountBookOutlined /> : <ApiOutlined />}</AccountIconWrapper>;
};
