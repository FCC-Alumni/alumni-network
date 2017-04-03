import React from 'react';
import { connect } from 'react-redux';
import Label from '../../common/UserLabel';
import DividingHeader from '../../common/DividingHeader';

import { viewThisUser } from '../../../actions/user';
import convertMonthToString from '../../../actions/convertMonth';

/*
TODO:
  - make sure social links work, user.social.SOCIAL_SITE should just be the username for this to work
  - Add dimmer and make cards link to user facing profile
  - add search feature so user can filter users
  - add deeper responsiveness for mobile - we will need to render a different card that shows less info for small devices
*/

class UserCard extends React.Component {

  handleClick = (user) => {
    this.props.viewThisUser(user);
    this.props.history.push(`/dashboard/profile/${user.username}`)
  }

  render() {

    const { user } = this.props;
    const joinedOn = user.personal.memberSince.split('-').slice(0, 2);
    const prettyDate = convertMonthToString(...joinedOn);
    var certs = [];
    for (var cert in user.fccCerts) {
      if (user.fccCerts[cert]) {
        certs.push(cert.replace(/_/g, ' '));
      }
    }

    return (
      <div style={{ cursor: "pointer" }} onClick={() => { this.handleClick(user) }} className='ui raised card'>
        <div className="ui slide masked reveal image">
          <img src={user.personal.avatarUrl} className="visible content" alt="user avatar"/>
          <div className="hidden content">
            <div className="labelWrapper">
              <Label
                image={user.personal.avatarUrl}
                size="large"
                username={user.username}
                label={user.mentorship.isMentor ? 'Mentor' : 'Member'} />
            </div>
            <div className="summaryWrapper">
              <DividingHeader size="h6" icon="checkmark box icon" content="Core Skills" />
              <div className="ui list">
                {
                  user.skillsAndInterests.coreSkills.length > 0 ?
                  user.skillsAndInterests.coreSkills.map((item, i) => i < 3 && <div className="item" key={i}>{item}</div>) :
                  'User has not entered any skills yet!'
                }
              </div>
              <DividingHeader size="h6" icon="checkmark box icon" content="Coding Interests" />
              <div className="ui list">
                {
                  user.skillsAndInterests.codingInterests.length > 0 ?
                  user.skillsAndInterests.codingInterests.map((item, i) => i < 3 && <div className="item" key={i}>{item}</div>) :
                  'User has not entered any interests yet!'
                }
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            {user.username}
          </div>
          <div className="meta">
            {user.mentorship.isMentor ? 'Mentor' : 'Member'}
          </div>
          <div className="description">
            <i className="yellow certificate icon" />
            {certs.toString().split(',').join(', ')}
          </div>
        </div>
        <div className="extra content">
          <span className="right floated">
            {`Joined ${prettyDate}`}
          </span>
          <span>
            <a target="_blank" href={user.personal.profileUrl}><i className="github icon"/></a>
            <a target="_blank" href={`https://www.freecodecamp.com/${user.username}`}><i className="fa fa-free-code-camp"/></a>
            { user.social.codepen && <a target="_blank" href={`https://www.freecodecamp.com/${user.username}`}><i className="codepen icon"/></a> }
            {/*these need to be fixed! just a potential */}
            { user.social.linkedin && <a target="_blank" href={`https://www.linkedin.com/search/results/index/?keywords=${encodeURIComponent(user.social.linkedin)}&origin=GLOBAL_SEARCH_HEADER`}><i className="linkedin icon"/></a> }
            { user.social.twitter && <a target="_blank" href={`https://www.twitter.com/${user.social.twitter}`}><i className="twitter icon"/></a> }
          </span>
        </div>
      </div>
    );
  }
}

export default connect(null, { viewThisUser })(UserCard);
