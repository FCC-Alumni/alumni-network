import React from 'react';
import propTypes from 'prop-types';
import FlashMessage from './FlashMessage';
import { connect } from 'react-redux';
import { deleteFlashMessage } from '../../actions/flashMessages';

class FlashMessagesList extends React.Component {
  render() {
    const { deleteFlashMessage } = this.props;
    const messages = this.props.messages.map(message =>
      <FlashMessage key={message.id} message={message} deleteFlashMessage={deleteFlashMessage}/>
    );
    return (
      <div className="ui container flash-message">{messages}</div>
    );
  }
}

FlashMessagesList.propTypes = {
  messages: propTypes.array.isRequired,
  deleteFlashMessage: propTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    messages: state.flashMessages
  }
}

export default connect(mapStateToProps, { deleteFlashMessage })(FlashMessagesList);
