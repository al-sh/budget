/* eslint-disable sort-keys */
import styled from 'styled-components';

export const Navbar = {
  Wrapper: styled.nav`
    flex: 1;
    align-self: flex-start;
    padding: 1rem 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    width: 100vw;
    bottom: 0;
  `,

  Items: styled.ul`
    display: flex;
    list-style: none;
  `,

  Item: styled.li<{ active: boolean }>`
    padding: 0 1rem;
    cursor: pointer;

    color: ${(props) => (props.active ? props.theme.text.active : props.theme.text.primary)};

    :hover {
      color: ${(props) => props.theme.text.hover};
    }
  `,
  Icon: styled.div`
    text-align: center;
  `,
};
