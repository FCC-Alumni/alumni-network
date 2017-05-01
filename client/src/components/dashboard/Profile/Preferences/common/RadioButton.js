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
  label: propTypes.string,
  name: propTypes.string.isRequired,
  checked: propTypes.bool.isRequired,
  onChange: propTypes.func.isRequired,
}

export default RadioButton;
