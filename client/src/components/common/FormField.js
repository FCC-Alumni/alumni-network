import React from 'react';
import propTypes from 'prop-types';

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
  actionIcon,
  placeholder,
  removeSocial,
  inputOptions,
  reactionIcon,
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
          placeholder={placeholder}
          readOnly={!onChange && true} />
        {
          (inputOptions.indexOf('corner') > -1 && !value) &&
          <a href={actionUrl}>
            <div
              style={{ cursor: 'pointer' }}
              className="ui corner green label"
              title="Sign in to retrieve your credentials">
              {actionIcon}
            </div>
          </a>
        }
        {
          (inputOptions.indexOf('corner') > -1 && value) &&
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => {clear(name)}}
            className="ui corner red label"
            title="Remove account">
            {reactionIcon}
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
  icon: propTypes.string,
  type: propTypes.string,
  label: propTypes.string,
  disabled: propTypes.bool,
  onChange: propTypes.func,
  tooltip: propTypes.string,
  actionUrl: propTypes.string,
  actionIcon: propTypes.object,
  placeholder: propTypes.string,
  inputOptions: propTypes.string,
  reactionIcon: propTypes.object,
  name: propTypes.string.isRequired,
  value: propTypes.string.isRequired,
  errors: propTypes.object.isRequired
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
