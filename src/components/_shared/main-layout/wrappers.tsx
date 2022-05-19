import styled, { createGlobalStyle } from 'styled-components';

export const AppWrapper = styled.div`
  max-width: 360px;
  overflow: hidden;
  display: flex;
  height: 100vh;
  flex-direction: column;
  background-color: ${(props) => props.theme.background.main};
  color: ${(props) => props.theme.text.primary};
`;

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
    font-family: sans-serif;  
  }
`;
