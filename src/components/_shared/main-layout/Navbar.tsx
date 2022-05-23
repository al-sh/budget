/* eslint-disable sort-keys */
import styled from 'styled-components';

export const Navbar = {
  Wrapper: styled.nav`
    bottom: 0;
    flex: 1;
    align-self: flex-start;
    padding: 1rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    width: 100%;
    max-width: inherit;
    overflow: hidden;
    background-color: ${({ theme }) => theme.background.main};
    z-index: 10000;
    border-top: 1px solid ${({ theme }) => theme.text.primary};
  `,

  Items: styled.ul`
    display: flex;
    list-style: none;
    margin-bottom: 0;
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
