import React from 'react';
import CertLinks from './CertLinks';
import { connect } from 'react-redux';
import styled from 'styled-components';
import SocialLinks from './SocialLinks';
import { connectScreenSize } from 'react-screen-size';
import { hoverTransition } from '../../../styles/globalStyles';
import convertMonthToString from '../../../actions/convertMonth';
import { initiatePrivateChat, clearNotifications } from '../../../actions/chat';

/*
TODO:
  -
*/

const Clickable = styled.div`
  cursor: pointer;
  &:hover {
    .user {
      color: #FF4025;
      transition: color 300ms ease-in-out;
    }
  }
`;

const CenteredWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: .7em;
`;

const SummaryWrapper = styled.div`
  text-align: center !important;
  font-size: 13.5px !important;
  padding: 7px 5px 0 5px;
`;

const ChatIcon = styled.i`
  font-size: 16px !important;
  margin-left: 4px !important;
  transition: color 200ms ease-in-out !important;
  &:hover {
    color: #007E00;
  }
`;

class UserCard extends React.Component {

  state = { reveal: false }

  initiatePrivateChat = (recipient, notifications) => {
    if (!this.props.privateChat.has(recipient)) {
      this.props.initiatePrivateChat(recipient);
    } else if (notifications) {
      this.props.clearNotifications({
        author: this.props.currentUser,
        recipient
      });
    }
    this.props.history.push(`chat/${recipient}`);
  }

  handleClick = (username) => {
    this.props.history.push(`/dashboard/profile/${username}`)
  }

  handleInnerClick = (e) => {
    e.stopPropagation();
  }

  reveal = () => {
    this.setState({ reveal: !this.state.reveal });
  }

  render() {
    const { user, screen: { isMobile, isDesktop }, currentUser, privateChat } = this.props;
    const joinedOn = user.personal.memberSince.split('-').slice(0, 2);
    const prettyDate = convertMonthToString(...joinedOn);
    const image = document.getElementsByClassName('avatarImg')[0];
    const notifications = privateChat.getIn([user, 'notifications'])
    const imageHeight = image && window.getComputedStyle(image).getPropertyValue('height');
    // used good ol' fashioned inline styles to control the reveal behavior on mobile
    // resolutions. For whatever reason, had a hard time overriding semantic-ui's transition
    // rules using styled-components. Trying to keep use of inline vs. styled-components as
    // consistent as possible, but in certain I am making concessions were necessary
    const IMAGE_STYLE = isDesktop
      ? {}
      : this.state.reveal
      ? { opacity: 0.01, transition: '.5s' }
      : { transition: '.5s', opacity: 1 };

    const CONTENT_STYLE = isDesktop
      ? {}
      : this.state.reveal && isMobile
      ? {
        height: imageHeight,
        position: 'absolute',
        transition: '.5s',
        opacity: 1,
        left: 0,
        top: 0
      }
      : {
        position: 'absolute',
        transition: '.5s',
        opacity: 0.01,
        left: 0,
        top: 0
      };

    return (
      <div className='ui raised card'>

      { (isDesktop || isMobile)
      ? <div className={`ui ${isDesktop ? 'slide masked reveal image' : 'image'}`}>
          <img
            style={IMAGE_STYLE}
            src={user.personal.avatarUrl}
            alt={`${user.username} avatar`}
            onClick={isMobile && this.reveal}
            className={`${isDesktop ? 'visible content' : 'avatarImg'}`} />
          <div
            style={CONTENT_STYLE}
            onClick={isMobile && this.reveal}
            className={`${(isDesktop || this.state.reveal) ? 'hidden content' : ''}`} >
            <SummaryWrapper>
              <div className="ui horizontal divider">Core Skills</div>
              <div className="ui list">
              { user.skillsAndInterests.coreSkills.length > 0 ?
                user.skillsAndInterests.coreSkills.map((item, i) => i < 3 && <div className="item" key={i}>{item}</div>) :
                'Not defined yet!' }
              </div>
              <div className="ui horizontal divider">Coding Interests</div>
              <div className="ui list">
              { user.skillsAndInterests.codingInterests.length > 0 ?
                user.skillsAndInterests.codingInterests.map((item, i) => i < 3 && <div className="item" key={i}>{item}</div>) :
                'Not defined yet!' }
              </div>
            </SummaryWrapper>
          </div>
        </div>
      : <div className="image">
          <img src={user.personal.avatarUrl} className="visible content" alt="user avatar"/>
        </div> }

        <Clickable onClick={() => { this.handleClick(user.username) }} className="content">
          <div className="header">
              <span className="user">{user.username}</span>
            { currentUser !== user.username &&
              <ChatIcon
                className="comments icon"
                title={`Start a chat with ${user.username}`}
                onClick={(e) => { this.initiatePrivateChat(user.username, notifications); e.stopPropagation(); }} /> }
            { (screen.isDesktop || screen.isMobile) &&
              <CertLinks
                username={user.username}
                fccCerts={user.fccCerts}
                handleClick={this.handleInnerClick} /> }
          </div>
          <div className="meta">
            {user.mentorship.isMentor ? 'Mentor' : 'Member'}
          </div>
        </Clickable>

        <div className="extra content">
          { (screen.isDesktop || screen.isMobile) ?
            <span className="right floated">
              {`Est. ${prettyDate}`}
            </span> :
            <CertLinks
              username={user.username}
              fccCerts={user.fccCerts}
              handleClick={this.handleInnerClick} /> }
          <span>
            <SocialLinks
              user={user}
              handleClick={this.handleInnerClick} />
          </span>
        </div>

      </div>
    );
  }
}

export const mapScreenSizeToProps = (screenSize) => {
  return { screen: {
    isTablet: screenSize['small'],
    isMobile: screenSize['mobile'],
    isDesktop: screenSize['> medium']
  }};
}

const mapStateToProps = (state) => {
  return {
    privateChat: state.privateChat,
    currentUser: state.user.username,
  }
}

const dispatch = {
  clearNotifications,
  initiatePrivateChat,
};

export default connectScreenSize(mapScreenSizeToProps)(
  connect(mapStateToProps, dispatch)(UserCard)
);
