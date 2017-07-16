import { connectScreenSize } from 'react-screen-size';
import { mapScreenSizeToProps } from '../../../../Navbar';
import { Popup } from 'semantic-ui-react';
import propTypes from 'prop-types';
import React from 'react';

const ErrorLabel = ({ isMobile, error }) => {
  const margin = isMobile ? { marginTop: 10 } : null;
  return (
    <div
      className={`ui ${!isMobile ? 'left pointing' : ''} red basic label`}
      style={margin}>
      {error}
    </div>
  )
};

const FormField = ({
  actionIcon,
  actionUrl,
  clear,
  disabled,
  errors,
  icon,
  infoMessage,
  inputOptions,
  isEmail,
  isPrivate,
  label,
  name,
  onChange,
  placeholder,
  reactionIcon,
  removeSocial,
  saveChanges,
  screen: { isMobile },
  toggleEmailVisibilty,
  tooltip,
  type,
  username,
  value,
}) => {
  const cornerLabel = (
    <a href={actionUrl} onClick={() => saveChanges()}>
      <div
        className="ui corner green label"
        style={{ cursor: 'pointer' }}>
        {actionIcon}
      </div>
    </a>
  );
  return (
    <div className="inline field">
      { label && <label>{label}</label> }
      <div className={`ui input ${inputOptions}`}>
        { icon &&  <i className={icon} /> }
        <input
          disabled={disabled}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={!onChange && true}
          title={tooltip}
          type={type}
          value={value} />
        { (inputOptions.indexOf('corner') > -1 && !value) &&
        <Popup
          inverted
          offset={5}
          position="top center"
          trigger={cornerLabel}
          wide>
          {`Sign in to your account to populate this field.
          We will not utilize your account in any way.`}
        </Popup> }
        { (inputOptions.indexOf('corner') > -1 && value) &&
        <div
          className="ui corner red label"
          onClick={() => clear(name)}
          style={{ cursor: 'pointer' }}
          title="Remove account">
          {reactionIcon}
        </div> }
      </div>
      { isEmail &&
      <div style={{ display: 'inline-block' }}>
        <Popup
          content={isPrivate
            ? 'Email will be hidden'
            : 'Email will be visible to FCCAN members'}
          inverted
          trigger={isPrivate
            ? <i className="big green toggle on icon"
                 onClick={toggleEmailVisibilty} />
            : <i className="big green toggle off icon"
                 onClick={toggleEmailVisibilty} /> }
          wide />
        <Popup
          content={infoMessage}
          inverted
          trigger={<i className="large red info circle icon" />}
          wide />
      </div> }
      { errors[name] &&
      <ErrorLabel error={errors[name]} isMobile={isMobile} /> }
    </div>
  )
}

FormField.propTypes = {
  actionIcon: propTypes.object,
  actionUrl: propTypes.string,
  disabled: propTypes.bool,
  errors: propTypes.object.isRequired,
  icon: propTypes.string,
  inputOptions: propTypes.string,
  isEmail: propTypes.bool,
  isPrivate: propTypes.bool,
  label: propTypes.string,
  name: propTypes.string.isRequired,
  onChange: propTypes.func,
  placeholder: propTypes.string,
  reactionIcon: propTypes.object,
  saveChanges: propTypes.func,
  screen: propTypes.object.isRequired,
  toggleEmailVisibilty: propTypes.func,
  tooltip: propTypes.string,
  type: propTypes.string,
  value: propTypes.string.isRequired,
}

FormField.defaultProps = {
  actionButton: false,
  disabled: false,
  icon: '',
  inputOptions: '',
  isEmail: false,
  label: '',
  type: 'text',
}

export default connectScreenSize(mapScreenSizeToProps)(FormField);
