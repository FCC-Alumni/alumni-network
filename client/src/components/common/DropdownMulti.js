import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const DropdownMulti = (props) => (
  <Dropdown
    { ...props }
    multiple
    selection />
);

DropdownMulti.propTypes = {
  options: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func.isRequired,
  placeholder: React.PropTypes.string,
  search: React.PropTypes.bool,
  noResultsMessage: React.PropTypes.string,
  fluid: React.PropTypes.bool,
  value: React.PropTypes.array.isRequired
}

DropdownMulti.defaultProps = {
  fluid: true,
  search: false,
  noResultsMessage: 'Sorry, no results...'
}

export default DropdownMulti;
