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
  search: propTypes.bool,
  placeholder: propTypes.string,
  value: propTypes.array.isRequired,
  noResultsMessage: propTypes.string,
  options: propTypes.array.isRequired,
  onChange: propTypes.func.isRequired,
}

DropdownMulti.defaultProps = {
  fluid: true,
  search: false,
  noResultsMessage: 'Sorry, no results...'
}

export default DropdownMulti;
