import React from 'react';
import propTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import { connectScreenSize } from 'react-screen-size';
import { mapScreenSizeToProps } from '../../../../Navbar';

const ErrorLabel = ({ isMobile, error }) => {
  const margin = isMobile ? { marginTop: 10 } : null;
  return (
    <div style={margin}
      className={`ui ${!isMobile ? 'left pointing' : ''} red basic label`}>
      {error}
    </div>
  )
};

const FormField = ({
  icon,
  type,
  name,
  label,
  clear,
  value,
  errors,
  isEmail,
  tooltip,
  onChange,
  username,
  disabled,
  actionUrl,
  isPrivate,
  actionIcon,
  placeholder,
  saveChanges,
  infoMessage,
  removeSocial,
  inputOptions,
  reactionIcon,
  screen: { isMobile },
  toggleEmailVisibilty,
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
          trigger={
            <a onClick={() => saveChanges(false)} href={actionUrl}>
              <div style={{ cursor: 'pointer' }} className="ui corner green label">
                {actionIcon}
              </div>
            </a>}>
          Sign in to your account to populate this field. We will not utilize your account in any way.
        </Popup> }
      { (inputOptions.indexOf('corner') > -1 && value) &&
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => clear(name)}
          className="ui corner red label"
          title="Remove account">
          {reactionIcon}
        </div> }
      </div>
    { isEmail &&
      <div style={{ display: 'inline-block' }}>
        <Popup
          inverted
          wide
          content={isPrivate ? 'Email will be hidden' : 'Email will be visible to FCCAN members'}
          trigger={isPrivate
            ? <i onClick={toggleEmailVisibilty} className="big green toggle on icon" />
            : <i onClick={toggleEmailVisibilty} className="big green toggle off icon" /> } />
        <Popup inverted wide content={infoMessage} trigger={<i className="large red info circle icon" />} />
      </div> }
    { errors[name] &&
      <ErrorLabel isMobile={isMobile} error={errors[name]} /> }
    </div>
  )
}

FormField.propTypes = {
  icon: propTypes.string,
  type: propTypes.string,
  isEmail: propTypes.bool,
  label: propTypes.string,
  disabled: propTypes.bool,
  onChange: propTypes.func,
  isPrivate: propTypes.bool,
  tooltip: propTypes.string,
  saveChanges: propTypes.func,
  actionUrl: propTypes.string,
  actionIcon: propTypes.object,
  placeholder: propTypes.string,
  inputOptions: propTypes.string,
  reactionIcon: propTypes.object,
  name: propTypes.string.isRequired,
  value: propTypes.string.isRequired,
  screen: propTypes.object.isRequired,
  errors: propTypes.object.isRequired,
  toggleEmailVisibilty: propTypes.func,
}

FormField.defaultProps = {
  icon: '',
  label: '',
  type: 'text',
  isEmail: false,
  disabled: false,
  inputOptions: '',
  actionButton: false
}

export default connectScreenSize(mapScreenSizeToProps)(FormField);
