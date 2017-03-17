import React from 'react';

/*
TODO: 
  - Make this use Semantics "dividing header" class instead
  - allow for passing in which size as props
  - this will make component more reusable and robust
  - then replace H2 in ChatContainer with this component
*/
const DividingHeader = ({ text }) => {
  return (
    <div className="ui secondary pointing menu">
      <div className="item">{text}</div>
    </div>
  );
}

DividingHeader.propTypes = {
  text: React.PropTypes.string.isRequired
}

export default DividingHeader;