import React from 'react';
import {
  CenterAlignedWrapper
} from '../../../../styles/globalStyles';

const Table = ({ children }) => {
  return(
    <div className="eight wide middle aligned column">
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
