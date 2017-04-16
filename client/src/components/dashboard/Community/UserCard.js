import React from 'react';
import CertLinks from './CertLinks';
import styled from 'styled-components';
import SocialLinks from './SocialLinks';
import { connectScreenSize } from 'react-screen-size';
import { hoverTransition } from '../../../styles/globalStyles';

import convertMonthToString from '../../../actions/convertMonth';

/*
TODO:
  - make sure social links work, user.social.SOCIAL_SITE should just be the username for this to work
  - Add reveal and make cards link to user facing profile
  - add search feature so user can filter users
  - add deeper responsiveness for mobile - we will need to render a different card that shows less info for small devices
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
  font-size: 12px !important;
  padding: 7px 5px 0 5px;
`;

class UserCard extends React.Component {

  handleClick = (user) => {
    this.props.history.push(`/dashboard/profile/${user.username}`)
  }

  handleInnerClick = (e) => {
    e.stopPropagation();
  }

  render() {

    const { user, screen } = this.props;
    const joinedOn = user.personal.memberSince.split('-').slice(0, 2);
    const prettyDate = convertMonthToString(...joinedOn);

    return (
      <div className='ui raised card'>

      { (screen.isDesktop || screen.isMobile)
      ? <div className="ui slide masked reveal image">
          <img src={user.personal.avatarUrl} className="visible content" alt="user avatar"/>
          <div className="hidden content">
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

        <Clickable onClick={() => { this.handleClick(user) }} className="content">
          <div className="header">
              <span className="user">{user.username}</span>
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

export default connectScreenSize(mapScreenSizeToProps)(UserCard);
