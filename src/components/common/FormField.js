import React from 'react';

export default function FormField({ label, onChange, value, type, name, errors }) {
  return (
    <div className="required field">
      <label>{label}</label>
      <input 
        onChange={onChange} 
        value={value} 
        type={type} 
        name={name} 
        placeholder={label}
      />
      <div className="ui error message">
        <p>{errors[name]}</p>
      </div>
    </div>
  )
}

FormField.propTypes = {
  label: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  value: React.PropTypes.string.isRequired,
  type: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  errors: React.PropTypes.object.isRequired
}

FormField.defaultProps = {
  type: "text"
}