import styled from 'styled-components';

export const darkGreen = 'teal'; // semantic color reassignment

export const CenterAlignedWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const ThickPaddedBottom = styled.div`
  padding-bottom: 50px !important;
`;

export const extendCenterAlignedWrapper = () => {
  return `
    display: flex;
    flex-direction: row;
    justify-content: center;
  `;
}

export const hoverTransition = () => {
  return  `
    transition: color 200ms ease-in-out !important;
    cursor: pointer;
    &:hover {
      color: #FF4025 !important;
    }
  `;
}

export const transitionIn = () => {
  return `
    overflow: hidden;
    opacity: 0.01;
    max-height: 0;
    transition:
      opacity 400ms ease-out,
      max-height 300ms ease;
  `;
}

export const transitionOut = () => {
  return  `
    opacity: 1.0;
    max-height: 700px;
    transition:
      opacity 500ms ease-in,
      max-height 400ms ease-out;
  `;
}
