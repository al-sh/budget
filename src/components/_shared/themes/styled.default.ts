import 'styled-components';

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

type Color = RGB | RGBA | HEX;

declare module 'styled-components' {
  interface DefaultTheme {
    background: {
      main: Color;
    };
    text: {
      active: Color;
      hover: Color;
      inactive: Color;
      primary: Color;
    };
  }
}
