import React from 'react';
import { connect } from 'react-redux';
import ListMaker from './common/ListMaker';

class Dashboard extends React.Component {
  state = {
    skills_list: []
  }
  
  saveSkills = (skills_list) => {
    this.setState({ skills_list });
  }
  
  render() {
    const { avatarUrl, username } = this.props.user;
    
    return (
      <div id="test" className="ui container">
        
        <div style={{ marginBottom: 20 }} className="ui padded huge teal image label">
          <img src={avatarUrl} alt="user avatar" />
          {username}
          <div className="detail">Verified User</div>
        </div>
        
        <form className="ui form">
          <div className="ui grid">
            <div className="column">
              <div className="ui raised segment">
                <div className="ui teal ribbon label">Personal Info</div>
                  
                <div className="ui list">
                  
                  <div className="item">
                    <i className="spy icon"></i>
                    <div className="content">{this.props.user.username}</div>
                  </div>
                  
                  <div className="item">
                    <i className="user icon"></i>
                    <div className="content">{this.props.githubData.name}</div>
                  </div>
                  
                  <div className="item">
                    <i className="github icon"></i>
                    <div className="content">
                      <a href={this.props.githubData.profileUrl} target="_blank">GitHub Profile</a>
                    </div>
                  </div>
                    
                </div>  
                
                <div className="ui teal ribbon label">Mentorship Program</div>
                
                <div className="ui teal info message">
                  Enter information about your coding skills below, so other users know your strengths!
                </div>  
                
                <div className="ui teal secondary pointing menu">
                  <div className="item">Core Skills</div>
                </div>
                <ListMaker
                  placeholder="Enter Skill"
                  labelStyle="ui tag label"
                  label="Add Skill"
                  icon="tag icon"
                  iconColor="teal"
                  saveListToParent={this.saveSkills}
                />
              
              </div>  
            </div>
          </div>
        </form>
        
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    githubData: state.user.githubData
  }
}

Dashboard.propTypes = {
  user: React.PropTypes.object.isRequired,
  githubData: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps)(Dashboard);