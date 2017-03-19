import React from 'react';

const RadioButton = ({ onChange, name, label }) => {
  return (
    <div>
      <div className="field">
        <div className="ui radio checkbox">
          <input 
            onChange={onChange} 
            type="radio" 
            id={label.replace(/\s/g, '_')} 
            name={name} />
          <label>{label}</label>
        </div>
      </div>
    </div>
  );
}

export default RadioButton;