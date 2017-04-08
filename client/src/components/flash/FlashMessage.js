import React from 'react';

class FlashMessage extends React.Component {

  handleClick = () => {
    this.props.deleteFlashMessage(this.props.message.id)
  }

  render() {
    const { type, text } = this.props.message;
    return (
      <div className={ type === 'error' ? 'ui error message' : 'ui info message' }>
        <i onClick={this.handleClick} className="close icon"></i>
        <div className="header">
          {text.header}
        </div>
        <p>
          {text.message}
        </p>
      </div>
    );
  }
}

FlashMessage.propTypes = {
  message: React.PropTypes.object.isRequired,
  deleteFlashMessage: React.PropTypes.func.isRequired
}

export default FlashMessage;
