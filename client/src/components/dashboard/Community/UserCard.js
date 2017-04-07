import React from 'react';
import CertLinks from './CertLinks';
import styled from 'styled-components';
import SocialLinks from './SocialLinks';
import Label from '../../common/UserLabel';
import { connectScreenSize } from 'react-screen-size';
import DividingHeader from '../../common/DividingHeader';

import convertMonthToString from '../../../actions/convertMonth';

/*
TODO:
  - make sure social links work, user.social.SOCIAL_SITE should just be the username for this to work
  - Add reveal and make cards link to user facing profile
  - add search feature so user can filter users
  - add deeper responsiveness for mobile - we will need to render a different card that shows less info for small devices
*/

// STYLES:
const ClickableCard = styled.div`
  cursor: pointer;
`;

const SummaryWrapper = styled.div`
  text-align: center !important;
  font-size: 12px !important;
`;

const CenteredWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: .7em;
  padding-bottom: 1em;
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
    var certs = [];
    for (var cert in user.fccCerts) {
      if (user.fccCerts[cert]) {
        certs.push(cert.replace(/_/g, ' '));
      }
    }

    return (
      <ClickableCard onClick={() => { this.handleClick(user) }} className='ui raised card'>

        { (screen.isDesktop || screen.isMobile) ?
          <div className="ui slide masked reveal image">
            <img src={user.personal.avatarUrl} className="visible content" alt="user avatar"/>
            <div className="hidden content">
              <CenteredWrapper>
                <Label
                  image={user.personal.avatarUrl}
                  size="large"
                  username={user.username} />
              </CenteredWrapper>
              <SummaryWrapper>
                <DividingHeader size="h6" icon="checkmark box icon" content="Core Skills" />
                <div className="ui list">
                  { user.skillsAndInterests.coreSkills.length > 0 ?
                    user.skillsAndInterests.coreSkills.map((item, i) => i < 3 && <div className="item" key={i}>{item}</div>) :
                    'User has not entered any skills yet!' }
                  </div>
                  <DividingHeader size="h6" icon="checkmark box icon" content="Coding Interests" />
                  <div className="ui list">
                    { user.skillsAndInterests.codingInterests.length > 0 ?
                      user.skillsAndInterests.codingInterests.map((item, i) => i < 3 && <div className="item" key={i}>{item}</div>) :
                      'User has not entered any interests yet!' }
                    </div>
                  </SummaryWrapper>
                </div>
              </div>
          :
          <div className="image">
            <img src={user.personal.avatarUrl} className="visible content" alt="user avatar"/>
          </div>
        }

        <div className="content">
          <div className="header">
            {user.username}
            { (screen.isDesktop || screen.isMobile) &&
              <CertLinks
                username={user.username}
                fccCerts={user.fccCerts}
                handleClick={this.handleInnerClick} /> }
          </div>
          <div className="meta">
            {user.mentorship.isMentor ? 'Mentor' : 'Member'}
          </div>
        </div>
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
      </ClickableCard>
    );
  }
}

const mapScreenSizeToProps = (screenSize) => {
  return { screen: {
    isTablet: screenSize['small'],
    isMobile: screenSize['mobile'],
    isDesktop: screenSize['> medium']
  }};
}

export default connectScreenSize(mapScreenSizeToProps)(UserCard);
