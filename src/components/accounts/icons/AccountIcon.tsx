import React from 'react';
import styled from 'styled-components';
import { getAccountIcon } from './icons';

const AccountIconWrapper = styled.span``;

export const AccountIcon: React.VFC<{ icon?: string }> = ({ icon }) => {
  return <AccountIconWrapper>{getAccountIcon(icon)}</AccountIconWrapper>;
};
