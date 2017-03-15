import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const DropdownMultiSelect = ({ options, onChange, placeholder }) => (
  <Dropdown placeholder={placeholder} onChange={onChange} fluid multiple selection options={options} />
)

DropdownMultiSelect.propTypes = {
  options: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func.isRequired,
  placeholder: React.PropTypes.string.isRequired
}

export default DropdownMultiSelect