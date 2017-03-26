import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const DropdownMultiSelect = ({ options, onChange, placeholder, fluid, value, search }) => (
  <Dropdown 
    placeholder={placeholder} 
    value={value} 
    onChange={onChange} 
    fluid={fluid} 
    search={search}
    multiple 
    selection 
    options={options} />
);

DropdownMultiSelect.propTypes = {
  options: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func.isRequired,
  placeholder: React.PropTypes.string,
  search: React.PropTypes.bool
}

DropdownMultiSelect.defaultProps = {
  fluid: true,
  search: false
}

export default DropdownMultiSelect