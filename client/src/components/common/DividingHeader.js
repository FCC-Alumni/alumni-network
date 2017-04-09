import React from 'react';
import propTypes from 'prop-types';

/*
TODO:
  - Make this use Semantics "dividing header" class instead
  - allow for passing in which size as props
  - this will make component more reusable and robust
  - then replace H2 in ChatContainer with this component
*/
const DividingHeader = ({ icon, content, size }) => {
  return (
    <div>
      {
        size === 'h1' &&
        <h1 className="ui horizontal divider header">
          { icon && <i className={icon} /> }
          {content}
        </h1>
      }
      {
        size === 'h2' &&
        <h2 className="ui horizontal divider header">
          { icon && <i className={icon} /> }
          {content}
        </h2>
      }
      {
        size === 'h3' &&
        <h3 className="ui horizontal divider header">
          { icon && <i className={icon} /> }
          {content}
        </h3>
      }
      {
        size === 'h4' &&
        <h4 className="ui horizontal divider header">
          { icon && <i className={icon} /> }
          {content}
        </h4>
      }
      {
        size === 'h5' &&
        <h5 className="ui horizontal divider header">
          { icon && <i className={icon} /> }
          {content}
        </h5>
      }
      {
        size === 'h6' &&
        <h6 className="ui horizontal divider header">
          { icon && <i className={icon} /> }
          {content}
        </h6>
      }
    </div>
  );
}

DividingHeader.propTypes = {
  content: propTypes.string.isRequired,
  icon: propTypes.string
}

DividingHeader.defaultProps = {
  icon: ''
}

export default DividingHeader;
