import ChatIconPopup from '../common/ChatIconPopup';
import { hoverTransition } from '../../../styles/style-utils';
import { isGitterUser } from '../../../actions/user';
import propTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  width: 45vw !important;
`;

const ChatIcon = styled.i`
  ${ hoverTransition() }
  font-size: 20px !important;
  margin-left: 4px !important;
  margin-bottom: 2px !important;
  ${props => props.disableChat && `
    color: lightgrey !important;
    cursor: default;
    &:hover {
      color: lightgrey !important;
    }
  `}
`;

const IMG = styled.img`
  border-radius: 100% !important;
  cursor: pointer;
`;

const Username = styled.div`
  ${ hoverTransition() }
`;

class UserCard extends React.Component {
  state = {
    disableChat: false
  }

  componentWillMount() {
    this.handleDisableChat();
  }

  handleDisableChat = () => {
    isGitterUser(this.props.user.username)
    .then(res => {
      if (this.refs.card) {
        switch (res.data.isGitterUser) {
          case false:
            this.setState({ disableChat: true });
            break;
          default: return;
        }
      }
    })
    .catch(err => console.error(err));
  }

  render() {
    const {
      currentUser,
      handleClick,
      initiatePrivateChat,
      user,
      user: {
        username,
      }
    } = this.props;

    return (
      <Card className="item" ref="card">
        <div className="ui tiny image">
          <IMG
            alt={`${username}'s avatar`}
            onClick={() => handleClick(user)}
            src={user.personal.avatarUrl}
            title={`View ${username}'s profile`} />
        </div>
        <div className="content">
          <Username
            className="header"
            onClick={() => handleClick(user)}
            title={`View ${username}'s profile`}>
            {username}
          </Username>
          { currentUser !== username &&
          <ChatIconPopup
            ChatIcon={ChatIcon}
            disableChat={this.state.disableChat}
            initiatePrivateChat={initiatePrivateChat}
            username={username} /> }
          <div className="meta">
            <span>
              <strong>
                {user.personal.displayName}
              </strong>
            </span>
            <i className="angle double right icon" />
            <span>
              {user.mentorship.isMentor ? 'Mentor' : 'Member'}
            </span>
          </div>
          <div className="description">
            { user.mentorship.isMentor
              ? user.mentorship.mentorshipSkills
              : user.personal.bio
              ? user.personal.bio
              : 'User has not yet created a bio' }
          </div>
        </div>
      </Card>
    );
  }
}

UserCard.propTypes = {
  currentUser: propTypes.string.isRequired,
  handleClick: propTypes.func.isRequired,
  initiatePrivateChat: propTypes.func.isRequired,
  user: propTypes.object.isRequired
}

export default UserCard;
