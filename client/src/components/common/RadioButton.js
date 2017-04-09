import React from 'react';
import propTypes from 'prop-types';

const RadioButton = ({ onChange, name, label, checked }) => {
  return (
    <div>
      <div className="field">
        <div className="ui radio checkbox">
          <input
            onChange={onChange}
            type="radio"
            id={label.replace(/\s/g, '_')}
            name={name}
            checked={checked} />
          <label>{label}</label>
        </div>
      </div>
    </div>
  );
}

RadioButton.propTypes = {
  onChange: propTypes.func.isRequired,
  name: propTypes.string.isRequired,
  label: propTypes.string,
  checked: propTypes.bool.isRequired
}

export default RadioButton;
