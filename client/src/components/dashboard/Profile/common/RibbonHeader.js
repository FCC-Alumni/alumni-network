import React from 'react';

const RibbonHeader = ({ content, onClick, wrapperClass, showPopUp, subSaveClick, id, showSave }) => {
  return(
    <div>
      <div className={`ui green large ribbon label ${wrapperClass}`} onClick={onClick}>
        {content}
        { 
          showSave && 
          <div className="detail">
            <i onClick={subSaveClick} id={id} className="saveSection save icon" />
          </div>
        }
      </div>
      <div className={`ui left pointing basic green label savedPopUp ${showPopUp ? 'show' : 'hide'}`}>Saved</div>
    </div>
  );
}

RibbonHeader.propTypes = {
  content: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
  wrapperClass: React.PropTypes.string.isRequired,
  showSave: React.PropTypes.bool.isRequired
}

export default RibbonHeader;