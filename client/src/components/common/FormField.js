import React from 'react';
import propTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';

const FormField = ({
  icon,
  info,
  type,
  name,
  label,
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
  infoMessage,
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
      { (inputOptions.indexOf('corner') > -1 && !value) &&
        <Popup
          wide
          inverted
          offset={5}
          position="top center"
          trigger={<a href={actionUrl}><div style={{ cursor: 'pointer' }} className="ui corner green label">{actionIcon}</div></a>}>
          Sign in to your account to populate this field. We will not utilize your account in any way.
        </Popup> }
      { (inputOptions.indexOf('corner') > -1 && value) &&
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {clear(name)}}
          className="ui corner red label"
          title="Remove account">
          {reactionIcon}
        </div> }
      </div>
    { info &&
      <Popup inverted wide="very" trigger={<i className="large red info circle icon" />}>
        {infoMessage}
      </Popup> }
    { errors[name] &&
      <div className="ui left pointing red basic label">
        {errors[name]}
      </div> }
    </div>
  )
}

FormField.propTypes = {
  info: propTypes.bool,
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
  info: false,
  type: 'text',
  disabled: false,
  inputOptions: '',
  actionButton: false
}

export default FormField;
