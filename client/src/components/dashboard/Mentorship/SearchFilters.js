import React from 'react';
import { Checkbox } from 'semantic-ui-react';

const Filters = ({ filterOptions, handleChange, state }) => {
  return(
    <div>
      {
        filterOptions.map(radio => {
          return (
            <div key={radio.name}>
              <Checkbox
                slider
                name={radio.name}
                label={radio.label}
                onChange={handleChange}
                checked={state[radio.name]} />
              <div className="spacer" />
            </div>
          );
        })
      }
    </div>
  );
}

Filters.propTypes = {
  state: React.PropTypes.object.isRequired,
  handleChange: React.PropTypes.func.isRequired,
  filterOptions: React.PropTypes.array.isRequired
}

export default Filters;
