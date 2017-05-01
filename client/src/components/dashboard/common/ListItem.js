import React from 'react';
import propTypes from 'prop-types';

const ListItem = ({ icon, children }) => {
  return (
    <div className="item">
      { icon && <i className={icon} /> }
      <div className="content">
        { children }
      </div>
    </div>
  );
}

ListItem.propTypes = {
  icon: propTypes.string,
  children: propTypes.node.isRequired
}

ListItem.defaultProps = {
  icon: ''
}

export default ListItem;
