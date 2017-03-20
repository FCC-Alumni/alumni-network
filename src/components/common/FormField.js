import React from 'react';

const FormField = ({ label, icon, onChange, value, type, name, errors, tooltip, inputOptions, placeholder }) => {
  return (
    <div className="inline field">
      { label && <label>{label}</label> } 
      <div className={`ui input ${inputOptions}`}>
        { icon &&  <i className={icon} /> }
        <input
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          title={tooltip}
          name={name}
          value={value} />
      </div>
      { errors[name] &&
        <div className="ui small left pointing red basic label">
          {errors[name]}
        </div> }
    </div>
  )
}

FormField.propTypes = {
  label: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  value: React.PropTypes.string.isRequired,
  type: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  errors: React.PropTypes.object.isRequired,
  placeholder: React.PropTypes.string,
  tooltip: React.PropTypes.string,
  icon: React.PropTypes.string,
  inputOptions: React.PropTypes.string
}

FormField.defaultProps = {
  type: 'text',
  icon: '',
  label: '',
  inputOptions: ''
}

export default FormField;
