import { Popup } from 'semantic-ui-react';
import propTypes from 'prop-types';
import React from 'react';

const ChatIconPopup = ({
  ChatIcon,
  disableChat,
  initiatePrivateChat,
  username
}) => {
  const chatIcon = (
    <ChatIcon
      className="comments icon"
      disableChat={disableChat}
      onClick={(e) => {
        !disableChat && initiatePrivateChat(username);
        e.stopPropagation();
      }
    } />
  );
  return (
    <Popup
      content={disableChat
        ? `${username} does not have a Gitter account`
        : `Start a Gitter chat with ${username}`}
      flowing
      inverted
      position="bottom left"
      trigger={chatIcon}
    />
  );
}

ChatIconPopup.propTpes = {
  ChatIcon: propTypes.element.isRequired,
  disableChat: propTypes.bool.isRequired,
  initiatePrivateChat: propTypes.func.isRequired,
  username: propTypes.string.isRequired,
}

export default ChatIconPopup;
