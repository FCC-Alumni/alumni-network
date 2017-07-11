import propTypes from 'prop-types';
import React from 'react';

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
  checked: propTypes.bool.isRequired,
  label: propTypes.string,
  name: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
}

export default RadioButton;
