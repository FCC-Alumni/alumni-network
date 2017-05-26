import React from 'react';
import {
  CenterAlignedWrapper
} from '../../../../styles/style-utils';

const Table = ({ children, columnWidth }) => {
  return (
    <div className={`${columnWidth} wide column`}>
      <CenterAlignedWrapper>
        <table className="ui very basic unstackable celled striped table">
          <tbody>
            { children }
          </tbody>
        </table>
      </CenterAlignedWrapper>
    </div>
  );
}

export default Table;
