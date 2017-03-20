import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const DropdownMultiSelect = ({ options, onChange, placeholder, defaultValue }) => (
  <Dropdown placeholder={placeholder} defaultValue={defaultValue} onChange={onChange} fluid multiple selection options={options} />
)

DropdownMultiSelect.propTypes = {
  options: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  defaultValue: React.PropTypes.array
}

export default DropdownMultiSelect