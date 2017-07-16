import propTypes from 'prop-types';
import React from 'react';
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
        { dismissable &&
          <i className="close icon" onClick={this.handleClick} /> }
        <div className="header">{header}</div>
        {message}
      </Message>
    );
  }
}

MessageBox.propTypes = {
  dismissable: propTypes.bool,
  header: propTypes.string,
  hide: propTypes.bool,
  message: propTypes.string.isRequired,
  type: propTypes.string,
}

export default MessageBox;
