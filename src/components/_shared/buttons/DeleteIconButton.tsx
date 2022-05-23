import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';

export const DeleteIconButton: React.VFC<{ onClick: () => void }> = ({ onClick }) => (
  <Button onClick={onClick} type="primary" htmlType="submit" icon={<DeleteOutlined />}></Button>
);
