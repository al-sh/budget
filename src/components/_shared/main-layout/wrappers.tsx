import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { getUiSizeService } from '../../../services/UiSizeService';

const Wrapper = styled.div<{ height: number; width: number }>`
  max-width: ${({ width }) => width}px;
  padding-bottom: 50px;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  height: ${({ height }) => height}px;
  flex-direction: column;
  background-color: ${({ theme }) => theme.background.main};
  color: ${({ theme }) => theme.text.primary};
`;

const _AppWrapper: React.FC = (props) => {
  const sizeService = getUiSizeService();

  const { height, width } = sizeService;

  useEffect(() => {
    sizeService.init();

    return () => {
      sizeService.destroy();
    };
  }, [sizeService]);

  return <Wrapper {...props} height={height} width={width} />;
};

export const AppWrapper = observer(_AppWrapper);

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
