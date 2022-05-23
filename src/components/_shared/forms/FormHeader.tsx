import styled from 'styled-components';
import { DeleteIconButton } from '../buttons/DeleteIconButton';

const FormHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.5em;
`;

export const FormHeader: React.VFC<{ onDeleteButtonClick: () => void; text: string }> = ({ onDeleteButtonClick, text }) => (
  <FormHeaderWrapper>
    <span>{text}</span>
    <span>
      <DeleteIconButton onClick={onDeleteButtonClick} />
    </span>
  </FormHeaderWrapper>
);
