import React from 'react';
import CertLinks from './CertLinks';
import { connect } from 'react-redux';
import styled from 'styled-components';
import SocialLinks from './SocialLinks';
import { connectScreenSize } from 'react-screen-size';
import parseDate from '../../../assets/helpers/parseDate';
import { initiatePrivateChat, clearNotifications } from '../../../actions/chat';

const Clickable = styled.div`
  cursor: pointer;
  &:hover {
    .user {
      color: #FF4025;
      transition: color 300ms ease-in-out;
    }
  }
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

  renderSkillsAndInterests = (skillsOrInterests) => {
    return skillsOrInterests.length > 0
      ? skillsOrInterests.map((item, i) => {
          return i < 3 && <div className="item" key={i}>{item}</div>})
      : 'Not defined yet!';
  }

  handleInnerClick = (e) => {
    e.stopPropagation();
  }

  reveal = () => {
    this.setState({ reveal: !this.state.reveal });
  }

  render() {

    const {
      user,
      currentUser,
      privateChat,
      screen: { isMobile, isDesktop },
      user: {
        skillsAndInterests: {
          coreSkills, codingInterests
        }
      },
    } = this.props;

    const image = document.getElementsByClassName('avatarImg')[0];
    const notifications = privateChat.getIn([user, 'notifications'])
    const joinedOn = parseDate(...user.personal.memberSince.split('-').slice(0, 2));
    const imageHeight = image && window.getComputedStyle(image).getPropertyValue('height');
    // used inline styles to control the reveal behavior on mobile resolutions.
    // Had a hard time overriding semantic-ui's transition rules using styled-components.
    // Trying to keep use of inline vs. styled-components as consistent as possible,
    // but in certain cases we are making concessions where necessary.
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
      <div
        className='ui raised card'
        style={ !isMobile ? { cursor: 'pointer' } : null }
        onClick={() => !isMobile && this.handleClick(user.username)}>

      {/* User Avatar & Reveal */}
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
                {this.renderSkillsAndInterests(coreSkills)}
              </div>
              <div className="ui horizontal divider">Coding Interests</div>
              <div className="ui list">
                {this.renderSkillsAndInterests(codingInterests)}
              </div>
            </SummaryWrapper>
          </div>
        </div>
      : <div className="image">
          <img src={user.personal.avatarUrl} className="visible content" alt="user avatar"/>
        </div> }

        {/********** Username, Status, & Certs **********/}
        <Clickable onClick={() => this.handleClick(user.username)} className="content">
          <div className="header">
            <span className="user">{user.username}</span>
          { currentUser !== user.username &&
            <ChatIcon
              className="comments icon"
              title={`Start a chat with ${user.username}`}
              onClick={(e) => {
                this.initiatePrivateChat(user.username, notifications);
                e.stopPropagation(); }} /> }
          { (isDesktop || isMobile) &&
            <CertLinks
              fccCerts={user.fccCerts}
              username={user.username}
              handleClick={this.handleInnerClick} /> }
          </div>
          <div className="meta">
            {user.mentorship.isMentor ? 'Mentor' : 'Member'}
          </div>
        </Clickable>

        {/**** User Meta Content ****/}
        <div className="extra content">
      { (isDesktop || isMobile)
        ? <span className="right floated">
            {`Since ${joinedOn}`}
          </span>
        : <CertLinks
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
