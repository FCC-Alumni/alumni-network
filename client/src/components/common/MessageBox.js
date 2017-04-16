import React from 'react';
import shortid from 'shortid';
import propTypes from 'prop-types';

class MessageBox extends React.Component {
  state = {
    style: {}
  }

  handleClick = (e) => {
    this.setState({ style: { display: "none" } });
  }

  render() {
    const { header, message, dismissable, type } = this.props;
    const dismiss = (
      <i onClick={this.handleClick} className="close icon" />
    );
    return (
      <div style={ this.state.style } className={`ui ${type} message`}>
        { dismissable && dismiss }
        <div className="header">{header}</div>
        {message}
      </div>
    );
  }
}

MessageBox.propTypes = {
  header: propTypes.string,
  message: propTypes.string.isRequired,
  color: propTypes.string
}

MessageBox.defaultProps = {
  color: 'green'
}

export default MessageBox;

// EXAMPLE USAGE
// <MessageBox
//   header="Would you like to be a mentor?"
//   message="The green goal of..."
//   dismissable={true}
//   color="red",
//   type="info"
// />
