import React from 'react';
import propTypes from 'prop-types';

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

  handleClick = () => {
    if (!this.state.on) {
      this.setState({ style: ON_POSITION, on: true });
      this.props.saveStateToParent(true);
    } else {
      this.setState({ style: OFF_POSITION, on: false });
      this.props.saveStateToParent(false);
    }
  }

  render() {
    return (
      <div className="slider-toggle-container">
        <div onClick={this.handleClick} className="slider-toggle">
          <div style={this.state.style} className="toggler" />
        </div>
        <label className="ui label green slider-label">{this.props.label}</label>
      </div>
    );
  }
}

SliderToggle.propTypes = {
  saveStateToParent: propTypes.func.isRequired,
  label: propTypes.string,
  defaultOn: propTypes.bool.isRequired
}

export default SliderToggle;
