import React from 'react';

class MessageBox extends React.Component {
  state = {
    style: {}
  }

  handleClick = () => {
    this.setState({ style: { display: "none" } });
  }

  render() {
    const { header, message, dismissable, type } = this.props;
    const dismiss = (
      <i onClick={this.handleClick} className="close icon"></i>
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
  header: React.PropTypes.string,
  message: React.PropTypes.string.isRequired,
  color: React.PropTypes.string
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
