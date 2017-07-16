import propTypes from 'prop-types';
import React from 'react';

const RadioButton = ({ onChange, name, label, checked }) => {
  return (
    <div>
      <div className="field">
        <div className="ui radio checkbox">
          <input
            checked={checked}
            id={label.replace(/\s/g, '_')}
            name={name}
            onChange={onChange}
            type="radio" />
          <label>{label}</label>
        </div>
      </div>
    </div>
  );
}

RadioButton.propTypes = {
  checked: propTypes.bool.isRequired,
  label: propTypes.string,
  name: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
}

export default RadioButton;
