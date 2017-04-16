import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import FlashMessage from './FlashMessage';
import { deleteFlashMessage } from '../../actions/flashMessages';


class FlashMessagesList extends React.Component {
  render() {

    const Container = styled.div`
      margin-top: ${ document.getElementById('navMenu') ? '120px' : '80px'} !important;
    `;

    const { deleteFlashMessage } = this.props;

    const messages = this.props.messages.map(message =>
      <FlashMessage key={message.id} message={message} deleteFlashMessage={deleteFlashMessage}/>
    );

    return (
      <Container className="ui container flash-message">{messages}</Container>
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
