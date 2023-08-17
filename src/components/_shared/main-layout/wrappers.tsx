import { observer } from 'mobx-react-lite';
import styled, { createGlobalStyle } from 'styled-components';

const Wrapper = styled.div`
  margin: auto;
  padding-bottom: 50px;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  height: 100vh;
  min-width: 350px;
  max-width: 600px;
  flex-direction: column;
  background-color: ${({ theme }) => theme.background.main};
  color: ${({ theme }) => theme.text.primary};
`;

export const AppWrapper = observer(Wrapper);

export const CSSReset = createGlobalStyle`
  *,
  *::before, 
  *::after {
    margin: 0; 
    padding: 0;
    box-sizing: inherit;
  }

  html {
    font-size: 62.5%; /*1rem = 10px*/
    box-sizing: border-box;    
  }  

  body {
    font-size: 1.4rem;
    
  }
`;
