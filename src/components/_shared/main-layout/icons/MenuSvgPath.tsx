import styled from 'styled-components';

export const MenuSvgPath = styled.path<{ active?: boolean }>`
  fill: ${({ theme, active }) => (active ? theme.text.active : theme.text.inactive)};
`;
