import propTypes from 'prop-types';
import React from 'react';

const TableRow = ({ icon, content, header }) => {
  return(
    <tr>
      <td>
        <h4 className="ui image header">
          { icon &&  <i className={`${icon} icon`}/> }
          <div className="content">{header}</div>
        </h4>
      </td>
      <td className="right aligned">
        { content }
      </td>
    </tr>
  );
}

TableRow.propTypes = {
  content: propTypes.oneOfType([
    propTypes.string,
    propTypes.object,
    propTypes.element,
    propTypes.number,
  ]),
  header: propTypes.oneOfType([
    propTypes.string,
    propTypes.element,
  ]),
  icon: propTypes.string.isRequired
}

TableRow.defaultProps = {
  icon: ''
}

export default TableRow;
