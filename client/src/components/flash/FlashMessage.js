import propTypes from 'prop-types';
import React from 'react';

class FlashMessage extends React.Component {

  handleClick = () => {
    this.props.clearFlashMessage()
  }

  render() {
    const { type, text } = this.props.message;
    return (
      <div className={`${type === 'error'
          ? 'ui error'
          : type === 'announcement'
          ? 'ui teal'
          : 'ui info'} message flashMessage`}>
        <i className="close icon" onClick={this.handleClick} />
        <div className="header">
          {text.header}
        </div>
        <p dangerouslySetInnerHTML={{ __html: text.message }} />
      </div>
    );
  }
}

FlashMessage.propTypes = {
  clearFlashMessage: propTypes.func.isRequired,
  message: propTypes.object.isRequired
}

export default FlashMessage;
