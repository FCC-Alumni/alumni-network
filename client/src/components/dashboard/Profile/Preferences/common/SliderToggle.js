import propTypes from 'prop-types';
import React from 'react';

const ON_POSITION = { left: 43 };
const OFF_POSITION = { left: 3 };

class SliderToggle extends React.Component {
  state = {
    on: false,
    style: OFF_POSITION
  }

  componentWillMount() {
    if (this.props.defaultOn) {
      this.setState({ style: ON_POSITION, on: true });
    }
  }

  handleClick = (id) => {
    if (!this.state.on) {
      this.setState({ style: ON_POSITION, on: true });
      this.props.saveStateToParent(true, id);
    } else {
      this.setState({ style: OFF_POSITION, on: false });
      this.props.saveStateToParent(false, id);
    }
  }

  render() {
    return (
      <div className="slider-toggle-container">
        <div onClick={() => this.handleClick(this.props.id)} className="slider-toggle">
          <div style={this.state.style} className="toggler" />
        </div>
        <label className="ui label green slider-label">{this.props.label}</label>
      </div>
    );
  }
}

SliderToggle.propTypes = {
  id: propTypes.string.isRequired,
  label: propTypes.string.isRequired,
  defaultOn: propTypes.bool.isRequired,
  saveStateToParent: propTypes.func.isRequired,
}

export default SliderToggle;
