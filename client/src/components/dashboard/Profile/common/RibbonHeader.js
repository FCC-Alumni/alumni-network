import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: 8px !important;
  margin-bottom: 8px !important;
  cursor: pointer;
  display: table;
`;

const RibbonHeader = ({ content, onClick, showPopUp, subSaveClick, id, showSave }) => {
  return (
    <Container>
      <div className="ui green large ribbon label" onClick={onClick}>
        {content}
      { showSave &&
        <div className="detail">
          <i onClick={subSaveClick} id={id} title="Save Section" className="saveSection save icon" />
        </div> }
      </div>
    { showSave && <div className={`ui left pointing basic green label savedPopUp ${showPopUp ? 'show' : 'hide'}`}>Saved</div> }
  </Container>
  );
}

RibbonHeader.propTypes = {
  onClick: propTypes.func.isRequired,
  showSave: propTypes.bool.isRequired,
  content: propTypes.string.isRequired,
}

export default RibbonHeader;
