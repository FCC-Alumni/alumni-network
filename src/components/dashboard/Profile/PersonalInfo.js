import React from 'react';
import ListItem from '../../common/ListItem';

const PersonalInfo = ({ username, showProfile, toggle, githubData, email, handleInputChange, location, bio, displayName }) => {
  return (
    <div>
      <div className="ui teal ribbon label profileWrapper" onClick={() => { toggle('showProfile') }}>Personal Info</div>
      <form className="ui form">
        <div className={`profilePane ${showProfile ? 'show' : 'hide'}`}>
          <div className="ui two column grid">
            <div className="four wide column">
              <div className="ui list">
                <ListItem icon="spy icon">
                  {username}
                </ListItem>
                <ListItem icon="github icon">
                  <a href={githubData.profileUrl} target="_blank">GitHub Profile</a>
                </ListItem>
                <ListItem>
                  <div className="ui transparent left icon input">
                    <i className="user icon" />
                    <input
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Enter Display Name..."
                      title="Display Name"
                      name="displayName"
                      value={displayName} />
                  </div>
                </ListItem>
                <ListItem>
                  <div className="ui transparent left icon input">
                    <i className="mail icon" />
                    <input
                      onChange={handleInputChange}
                      type="email"
                      placeholder="Enter Email..."
                      title="Email"
                      name="email"
                      value={email} />
                  </div>
                </ListItem>
                <ListItem>
                  <div className="ui transparent left icon input">
                    <i className="marker icon" />
                    <input
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Enter Location..."
                      title="Location"
                      name="location"
                      value={location} />
                  </div>
                </ListItem>
              </div>
            </div>
            <div className="eight wide column">
              <div className="ui eight wide field">
                <label>Bio</label>
                <textarea
                  onChange={handleInputChange}
                  name='bio'
                  rows="4"
                  value={bio} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PersonalInfo;