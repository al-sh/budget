import { Spin } from 'antd';

interface Props {
  size?: 'small' | 'large' | 'default';
}

export const Loader = ({ size }: Props) => {
  return <Spin size={size} />;
};
