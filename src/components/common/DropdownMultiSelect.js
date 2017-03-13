import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const DropdownMultiSelect = ({ options, onChange, placeholder }) => (
  <Dropdown placeholder={placeholder} onChange={onChange} fluid multiple selection options={options} />
)

export default DropdownMultiSelect