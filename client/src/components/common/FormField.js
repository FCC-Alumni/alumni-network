import React from 'react';

const FormField = ({
  icon,
  label,
  type,
  name,
  clear,
  value,
  errors,
  tooltip,
  onChange,
  username,
  disabled,
  actionUrl,
  actionText,
  placeholder,
  removeSocial,
  inputOptions,
  reactionText,
}) => {
  return (
    <div className="inline field">
      { label && <label>{label}</label> }
      <div className={`ui input ${inputOptions}`}>
        { icon &&  <i className={icon} /> }
        <input
          type={type}
          name={name}
          value={value}
          title={tooltip}
          disabled={disabled}
          onChange={onChange}
          placeholder={placeholder} />
        {
          (inputOptions.indexOf('corner') > -1 && !value) &&
          <a href={actionUrl}>
            <div
              style={{ cursor: 'pointer' }}
              className="ui corner green label"
              title="Sign in to retrieve your credentials">
              {actionText}
            </div>
          </a>
        }
        {
          (inputOptions.indexOf('corner') > -1 && value) &&
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => {clear(name)}}
            className="ui corner red label">
            {reactionText}
          </div>
        }
      </div>
      { errors[name] &&
        <div className="ui small left pointing red basic label">
          {errors[name]}
        </div> }
    </div>
  )
}

FormField.propTypes = {
  icon: React.PropTypes.string,
  type: React.PropTypes.string,
  label: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  tooltip: React.PropTypes.string,
  actionUrl: React.PropTypes.string,
  actionText: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  inputOptions: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired,
  errors: React.PropTypes.object.isRequired
}

FormField.defaultProps = {
  icon: '',
  label: '',
  type: 'text',
  disabled: false,
  inputOptions: '',
  actionButton: false
}

export default FormField;
