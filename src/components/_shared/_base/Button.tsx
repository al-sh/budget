/* eslint-disable @typescript-eslint/no-empty-interface */
import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd';
import { CSSProperties } from 'react';

export interface ButtonProps extends AntdButtonProps {}

export const Button: React.VFC<ButtonProps> = ({ ...props }) => {
  const style: CSSProperties = {
    background: props.type === 'primary' ? 'linear-gradient(180deg, #008f8c 0%, #0fc2c0 100%)' : '',
    border: 'none',
  };
  return <AntdButton {...props} style={style} />;
};
