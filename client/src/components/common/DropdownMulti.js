import React from 'react';
import propTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

const DropdownMulti = (props) => (
  <Dropdown
    { ...props }
    multiple
    selection />
);

DropdownMulti.propTypes = {
  options: propTypes.array.isRequired,
  onChange: propTypes.func.isRequired,
  placeholder: propTypes.string,
  search: propTypes.bool,
  noResultsMessage: propTypes.string,
  fluid: propTypes.bool,
  value: propTypes.array.isRequired
}

DropdownMulti.defaultProps = {
  fluid: true,
  search: false,
  noResultsMessage: 'Sorry, no results...'
}

export default DropdownMulti;
