import React from 'react';
import convertMonthToString from '../../../actions/convertMonth';

/*
TODO:
  - make sure social links work, user.social.SOCIAL_SITE should just be the username for this to work
  - Add dimmer and make cards link to user facing profile
  - add search feature so user can filter users
  - add deeper responsiveness for mobile - we will need to render a different card that shows less info for small devices
*/

const UserCard = ({ user }) => {
  
  const joinedOn = user.personal.memberSince.split('-').slice(0, 2);
  const prettyDate = convertMonthToString(...joinedOn);
  var certs = [];
  for (var cert in user.fccCerts) {
    if (user.fccCerts[cert]) {
      certs.push(cert.replace(/_/g, ' ') + ', ');
    }
  }
  var lastIndex = certs.length - 1;
  certs[lastIndex] = certs[certs.length-1].slice(0, -2);
  
  return(
    <div className='ui raised card'>
      <div className="image">
        <img src={user.personal.avatarUrl} alt="user avatar"/>
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
          {certs}
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
          { user.social.linkedin && <a target="_blank" href={`https://www.linkedin.com/${user.social.linkedin}`}><i className="linkedin icon"/></a> }
          { user.social.twitter && <a target="_blank" href={`https://www.twitter.com/${user.social.twitter}`}><i className="twitter icon"/></a> }
        </span>
      </div>
    </div>
  );
}

export default UserCard;