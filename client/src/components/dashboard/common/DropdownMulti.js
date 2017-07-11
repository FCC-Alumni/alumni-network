import { Dropdown } from 'semantic-ui-react';
import propTypes from 'prop-types';
import React from 'react';

const DropdownMulti = (props) => (
  <Dropdown
    { ...props }
    multiple
    selection />
);

DropdownMulti.propTypes = {
  fluid: propTypes.bool,
  noResultsMessage: propTypes.string,
  onChange: propTypes.func.isRequired,
  options: propTypes.array.isRequired,
  placeholder: propTypes.string,
  search: propTypes.bool,
  value: propTypes.array.isRequired,
}

DropdownMulti.defaultProps = {
  fluid: true,
  noResultsMessage: 'Sorry, no results...',
  search: false,
}

export default DropdownMulti;
