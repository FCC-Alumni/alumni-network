import React from 'react';
import styled from 'styled-components';

const StyledItem = styled.div`
  color: black !important;
  font-weight: bold !important;
  .icon {
    color: black !important;
  }
  cursor: pointer;
  &:hover {Styled
    background: #E0E0E0 !important;
    .icon {
      color: #FF4025 !important;
      transition: color 200ms ease-in-out !important;
    }
  }
`;

const RepoListItem = ({el, removeItem, editItem, index}) => {
  return (
    <StyledItem key={index} className="item">
      <div className="right floated content">
        <a><i onClick={removeItem} className="remove icon"/></a>
        <a><i onClick={editItem} className="edit icon"/></a>
      </div>
      <a
        href={`${el.label}${el.item}`}
        target="_blank"
        className="content">
        {`${el.label}${el.item}`}
      </a>
    </StyledItem>
  );
};
export default RepoListItem
