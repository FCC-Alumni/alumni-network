import axios from 'axios';
import LocalChat from './dashboard/Chat/ChatController';
import React from 'react';
import styled from 'styled-components';

const MyFrame = styled.iframe`
  position: fixed;
  top: 60px;
`;

/* use the same component for both private and global chat
routes. If there is a username param, we know its a private
chat and we load a gitter embed with that person's username.
This should be ok because all gitter usernames are the same
as users' github usernames, thus the same as our usernames.
Even for whitelisted users. If the conditional is false, no
username param exists, then load FCCAN channel instead. */

/*
  TODO:
  - this solution DOES NOT account for if a FCCAN member is
    not a gitter user! When we click on a private chat link
    if the user is not a member, we get a 404 message.
  - these styles are a little wonky. Kind of forces things
    a bit. Not ideal for mobile. This could be improved.
*/

const GitterEmbed = ({ match: { params: { username } }}) => {
  if (username)
    return (
      <MyFrame
        frameBorder="0"
        height="93%"
        src={`https://gitter.im/${username}/~embed`}
        width="100%" />
    );
  return (
    <MyFrame
      frameBorder="0"
      height="93%"
      src="https://gitter.im/fcc-alumni/Lobby/~embed"
      width="100%" />
  );
}

export default GitterEmbed;
