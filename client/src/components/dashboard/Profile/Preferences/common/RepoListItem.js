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
    <StyledItem className="item" key={index}>
      <div className="right floated content">
        <a><i className="remove icon" onClick={removeItem} /></a>
        <a><i className="edit icon" onClick={editItem} /></a>
      </div>
      <a
        className="content"
        href={`${el.label}${el.item}`}
        rel="noreferrer noopener"
        target="_blank" >
        {`${el.label}${el.item}`}
      </a>
    </StyledItem>
  );
};
export default RepoListItem
