import React from 'react';
import styled from 'styled-components';

const MyFrame = styled.iframe`
  height: calc(100% - 60px);
  position: fixed;
  top: 60px;
`;

/* use the same component for both private and global chat
routes. If there is a username param, we know its a private
chat and we load a gitter embed with that person's username.
This should be ok because all gitter usernames are the same
as users' github usernames, thus the same as our usernames.
If the conditional is false, no username paramater exists,
then we load the main FCCAN Gitter channel instead. */

/* NOTE: this solution does not work for whitelisted
users. If a user is whitelisted, we overwrite their GH
username with their FCC username to allow for login and
user verification, and so that all external FCCAN links
will work. No users are yet whitelisted, so this bridge
can be crossed when we get to it (perhaps by adding a
'whitelisted' field to the usermodel and by saving the
GH username as well if this is the case). For now it is
still unlikely that we will encounter this problem. */

/* TODO:
  - these styles are a little wonky. Kind of forces things
    a bit. Not ideal for mobile. This could be improved.
*/

const GitterEmbed = ({ match: { params: { username }}}) => {
  if (username) {
    return (
      <MyFrame
        frameBorder="0"
        height="100%"
        src={`https://gitter.im/${username}/~embed`}
        width="100%" />
    );
  }
  return (
    <MyFrame
      frameBorder="0"
      height="100%"
      src="https://gitter.im/fcc-alumni/#/~embed"
      width="100%" />
  );
}

export default GitterEmbed;
