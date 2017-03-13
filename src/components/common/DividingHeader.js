import React from 'react';

export default function DividingHeader({ text }) {
  return (
    <div className="ui secondary pointing menu">
      <div className="item">{text}</div>
    </div>
  );
}

DividingHeader.propTypes = {
  text: React.PropTypes.string.isRequired
}