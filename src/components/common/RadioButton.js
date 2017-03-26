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
  onChange: React.PropTypes.func.isRequired,
  name: React.PropTypes.string.isRequired,
  label: React.PropTypes.string,
  checked: React.PropTypes.bool.isRequired
}

export default RadioButton;