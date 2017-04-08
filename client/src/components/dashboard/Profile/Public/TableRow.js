import React from 'react';

const TableRow = ({ icon, content, header }) => {
  return(
    <tr>
      <td>
        <h4 className="ui image header">
          <i className={`${icon} icon`}/>
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
  icon: React.PropTypes.string.isRequired,
  header: React.PropTypes.oneOfType([
    React.PropTypes: string,
    React.PropTypes: element,
  ]),
  content: React.PropTypes.oneOfType([
    React.PropTypes: string,
    React.PropTypes: object,
    React.PropTypes: element,
    React.PropTypes: number,
  ])
}

export default TableRow;
