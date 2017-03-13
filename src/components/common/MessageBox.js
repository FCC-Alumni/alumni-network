import React from 'react';

class MessageBox extends React.Component {
  state = {
    style: {}
  }
  
  handleClick = () => {
    const { style } = this.state;
    style.display = "none";
    this.setState({ style });
  }
  
  render() {
    const { header, message, color, dismissable, type } = this.props;
    const dismiss = (
      <i onClick={this.handleClick} className="close icon"></i>
    );
    return (
      <div style={ this.state.style } className={"ui message " + color + ' ' + type}>
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
  color: 'teal'
}

export default MessageBox;

// EXAMPLE USAGE
// <MessageBox 
//   header="Would you like to be a mentor?"
//   message="The primary goal of..."
//   dismissable={true}
//   color="red",
//   type="info"
// />