import React from 'react';
import propTypes from 'prop-types';

const RibbonHeader = ({ content, onClick, wrapperClass, showPopUp, subSaveClick, id, showSave }) => {
  return(
    <div>
      <div className={`ui green large ribbon label ${wrapperClass}`} onClick={onClick}>
        {content}
      { showSave &&
        <div className="detail">
          <i onClick={subSaveClick} id={id} className="saveSection save icon" />
        </div> }
      </div>
    { showSave && <div className={`ui left pointing basic green label savedPopUp ${showPopUp ? 'show' : 'hide'}`}>Section Saved</div> }
    </div>
  );
}

RibbonHeader.propTypes = {
  onClick: propTypes.func.isRequired,
  showSave: propTypes.bool.isRequired,
  content: propTypes.string.isRequired,
  wrapperClass: propTypes.string.isRequired,
}

export default RibbonHeader;
