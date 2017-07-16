import propTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: 8px !important;
  margin-bottom: 8px !important;
  cursor: pointer;
  display: table;
`;

const RibbonHeader = ({
  content,
  id,
  onClick,
  saveSection,
  showPopUp,
  showSave
}) => {
  return (
    <Container>
      <div className="ui green large ribbon label" onClick={onClick}>
        {content}
        { showSave &&
        <div className="detail">
          <i
            className="saveSection save icon"
            id={id}
            onClick={saveSection}
            title="Save Section" />
        </div> }
      </div>
      { showSave &&
      <div
        className={`ui left pointing basic green label savedPopUp ${showPopUp
          ? 'show'
          : 'hide'}`}>
        {'Saved'}
      </div> }
    </Container>
  );
}

RibbonHeader.propTypes = {
  content: propTypes.string.isRequired,
  onClick: propTypes.func.isRequired,
  showSave: propTypes.bool.isRequired,
}

export default RibbonHeader;
