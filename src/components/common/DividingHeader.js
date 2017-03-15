import React from 'react';

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