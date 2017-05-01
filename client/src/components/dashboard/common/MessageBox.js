import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';

class MessageBox extends React.Component {
  state = {
    hidden: false
  }

  handleClick = (e) => {
    this.setState({ hidden: true });
  }

  render() {
    const { header, message, dismissable, type, hide } = this.props;
    const { hidden } = this.state;
    const Message = styled.div`
      ${ (hidden || hide) && 'display: none !important;'}
    `;
    return (
      <Message className={`ui ${type} message`}>
        { dismissable && <i onClick={this.handleClick} className="close icon" /> }
        <div className="header">{header}</div>
        {message}
      </Message>
    );
  }
}

MessageBox.propTypes = {
  hide: propTypes.bool,
  type: propTypes.string,
  header: propTypes.string,
  dismissable: propTypes.bool,
  message: propTypes.string.isRequired,
}

export default MessageBox;
