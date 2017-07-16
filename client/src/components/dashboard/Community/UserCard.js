import CertLinks from './CertLinks';
import ChatIconPopup from '../common/ChatIconPopup';
import { connect } from 'react-redux';
import { connectScreenSize } from 'react-screen-size';
import { isGitterUser } from '../../../actions/user';
import parseDate from '../../../assets/helpers/parseDate';
import React from 'react';
import SocialLinks from './SocialLinks';
import styled from 'styled-components';

const ChatIcon = styled.i`
  font-size: 16px !important;
  margin-left: 4px !important;
  transition: color 200ms ease-in-out !important;
  &:hover {
    color: #007E00;
  }
  ${props => props.disableChat && `
    color: lightgrey !important;
    cursor: default;
    &:hover {
      color: lightgrey !important;
    }
  `}
`;

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
  font-size: 13.5px !important;
  padding: 7px 5px 0 5px;
  text-align: center !important;
`;

class UserCard extends React.Component {
  state = {
    disableChat: false,
    reveal: false
  }

  componentWillMount() {
    this.handleDisableChat();
  }

  handleClick = (username) => {
    this.props.history.push(`/dashboard/profile/${username}`)
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

  handleInnerClick = (e) => {
    e.stopPropagation();
  }

  initiatePrivateChat = (recipient) => {
    this.props.history.push(`chat/${recipient}`);
  }

  renderSkillsAndInterests = (skillsOrInterests) => {
    return skillsOrInterests.length > 0
      ? skillsOrInterests.map((item, i) => {
          return i < 3 && <div className="item" key={item}>{item}</div>})
      : 'Not defined yet!';
  }

  reveal = () => {
    this.setState({ reveal: !this.state.reveal });
  }

  render() {

    const {
      user,
      user: {
        username
      },
      currentUser,
      screen: { isMobile, isDesktop },
      user: {
        skillsAndInterests: {
          coreSkills, codingInterests
        }
      },
    } = this.props;

    const image = document.getElementsByClassName('avatarImg')[0];
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
      : { opacity: 1, transition: '.5s' };

    const CONTENT_STYLE = isDesktop
      ? {}
      : this.state.reveal && isMobile
      ? {
        height: imageHeight,
        left: 0,
        opacity: 1,
        position: 'absolute',
        top: 0,
        transition: '.5s',
      }
      : {
        left: 0,
        opacity: 0.01,
        position: 'absolute',
        top: 0,
        transition: '.5s',
      };

    return (
      <div
        className='ui raised card'
        onClick={() => !isMobile && this.handleClick(username)}
        ref="card"
        style={ !isMobile ? { cursor: 'pointer' } : null }>

        {/* User Avatar & Reveal */}
      { (isDesktop || isMobile)
      ? <div className={`ui ${isDesktop ? 'slide masked reveal image' : 'image'}`}>
          <img
            alt={`${username} avatar`}
            className={`${isDesktop ? 'visible content' : 'avatarImg'}`}
            onClick={isMobile && this.reveal}
            src={user.personal.avatarUrl}
            style={IMAGE_STYLE} />
          <div
            className={`${(isDesktop || this.state.reveal)
              ? 'hidden content'
              : ''}`}
            onClick={isMobile && this.reveal}
            style={CONTENT_STYLE}>
            <SummaryWrapper>
              <div className="ui horizontal divider">{'Core Skills'}</div>
              <div className="ui list">
                {this.renderSkillsAndInterests(coreSkills)}
              </div>
              <div className="ui horizontal divider">{'Coding Interests'}</div>
              <div className="ui list">
                {this.renderSkillsAndInterests(codingInterests)}
              </div>
            </SummaryWrapper>
          </div>
        </div>
      : <div className="image">
          <img
            alt="user avatar"
            className="visible content"
            src={user.personal.avatarUrl} />
        </div> }

        {/********** Username, Status, & Certs **********/}
        <Clickable
          className="content"
          onClick={() => this.handleClick(username)}>
          <div className="header">
            <span className="user">{username}</span>
            { currentUser !== username &&
            <ChatIconPopup
              ChatIcon={ChatIcon}
              disableChat={this.state.disableChat}
              initiatePrivateChat={this.initiatePrivateChat}
              username={username} /> }
            { (isDesktop || isMobile) &&
            <CertLinks
              fccCerts={user.fccCerts}
              handleClick={this.handleInnerClick}
              username={username} /> }
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
            fccCerts={user.fccCerts}
            handleClick={this.handleInnerClick}
            username={username} /> }
          <span>
            <SocialLinks
              handleClick={this.handleInnerClick}
              user={user} />
          </span>
        </div>
      </div>
    );
  }
}

export const mapScreenSizeToProps = (screenSize) => {
  return { screen: {
    isDesktop: screenSize['> medium'],
    isMobile: screenSize['mobile'],
    isTablet: screenSize['small'],
  }};
}

export default connectScreenSize(mapScreenSizeToProps)(
  connect(state => ({ currentUser: state.user.username }))(UserCard)
);
