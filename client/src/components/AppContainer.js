import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { populateCommunity } from '../actions/community';
import { populateChat, fetchPrivateChat } from '../actions/chat';
import { saveUser, getUserData, logoutUser } from '../actions/user';
import { addFlashMessage, clearFlashMessage } from '../actions/flashMessages';

import Landing from './dashboard/Landing';
import Community from './dashboard/Community';
import Mentorship from './dashboard/Mentorship';
import Chat from './dashboard/Chat/ChatController';
import Profile_Config from './dashboard/Profile_Config';
import Profile_Public from './dashboard/Profile_Public';

class AppContainer extends React.Component {

  componentDidMount() {
    getUserData().then(user => {
      if (user) {
        // fetch user, community, and chat data when dashboard loads:
        this.props.saveUser(user);
        this.props.populateCommunity();
        this.props.populateChat();
        this.props.fetchPrivateChat(user.username);

      } else {
        this.props.logoutUser();
        this.props.addFlashMessage({
          type: 'error',
            text: {
              header: 'Access forbiden!',
              message: 'Please signup and/or login to view this page.'
            }
          });
        this.props.history.push('/login');
      }
    }).catch(err => {
      this.props.history.push('/login')
      this.props.logoutUser();
      this.props.addFlashMessage({
        type: 'error',
          text: {
            header: 'Something went wrong...',
            message: 'Please sign in again.'
          }
        });
    });
  }

  componentDidUpdate() {
    // this will clear flash messages when user navigates to a new route...
    // if this produces other unwanted behavior we can revise
    this.props.clearFlashMessage();
  }

  render() {
    const { url } = this.props.match;
    return (
      <div>
        { this.props.username &&
          <div>
            <Route exact path={`${url}/`} component={Landing}/>
            <Route exact path={`${url}/preferences`} component={Profile_Config}/>
            <Route exact path={`${url}/profile/:username`} component={Profile_Public}/>
            <Route exact path={`${url}/community`} component={Community}/>
            <Route exact path={`${url}/mentorship`} component={Mentorship}/>
            <Route exact path={`${url}/chat`} component={Chat}/>
            <Route exact path={`${url}/chat/:username`} component={Chat}/>
          </div>
        }
      </div>
    );
  }
};

AppContainer.propTypes = {
  saveUser: React.PropTypes.func.isRequired,
  username: React.PropTypes.string.isRequired,
  populateChat: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired,
  clearFlashMessage: React.PropTypes.func.isRequired,
  populateCommunity: React.PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    username: state.user.username
  }
}

const dispatch = {
  saveUser,
  logoutUser,
  populateChat,
  addFlashMessage,
  fetchPrivateChat,
  clearFlashMessage,
  populateCommunity,
}

export default connect(mapStateToProps, dispatch)(AppContainer);
