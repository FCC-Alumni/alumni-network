import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import FlashMessage from './FlashMessage';
import { mapScreenSizeToProps } from '../Navbar';
import { connectScreenSize } from 'react-screen-size';
import { deleteFlashMessage } from '../../actions/flashMessages';


class FlashMessagesList extends React.Component {
  render() {

    const { deleteFlashMessage, location: { pathname }, screen: { isDesktop } } = this.props;

    const Container = !isDesktop && (pathname === '/about' || pathname === '/login' || pathname === '/')
      ? styled.div`
          margin-top: 120px;
          margin-bottom: 20px;
        `
      : styled.div`
          margin-top: 80px;
          margin-bottom: 20px;
        `;

    const messages = this.props.messages.map(message =>
      <FlashMessage key={message.id} message={message} deleteFlashMessage={deleteFlashMessage}/>
    );

    return (
      <Container className="ui container">{messages}</Container>
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

export default connectScreenSize(mapScreenSizeToProps)(
  connect(mapStateToProps, { deleteFlashMessage })(FlashMessagesList)
);
