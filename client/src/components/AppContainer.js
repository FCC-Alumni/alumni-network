import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { socket } from '../actions/chat';
import { populateCommunity } from '../actions/community';
import { populateChat, fetchPrivateChat } from '../actions/chat';
import { saveUser, getUserData, logoutUser } from '../actions/user';
import { addFlashMessage, clearFlashMessage } from '../actions/flashMessages';

import { CatchAll } from '../App';
import Landing from './dashboard/Landing';
import Community from './dashboard/Community';
import Mentorship from './dashboard/Mentorship';
import Chat from './dashboard/Chat/ChatController';
import Profile_Config from './dashboard/Profile_Config';
import Profile_Public from './dashboard/Profile_Public';
import Account from './dashboard/Account';

class AppContainer extends React.Component {

  componentDidMount() {
    getUserData().then(user => {
      if (user) {
        // fetch user, community, and chat data when dashboard loads:
        this.props.saveUser(user);
        // only fetch chat and community if none exists
        if (!this.props.community) this.props.populateCommunity();
        if (!this.props.chat) this.props.populateChat();
        this.props.fetchPrivateChat(user.username);

        // announce this user is now online, should refresh status if user reloads page:
        socket.emit('user-online', { user: user.username });

      } else {
        this.props.logoutUser();
        this.props.addFlashMessage({
          type: 'error',
            text: {
              header: 'Access forbidden!',
              message: 'Please signup and/or login to view this page.'
            }
          });
        this.props.history.push('/login');
      }
    }).catch(err => {
      console.log(err);
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

  componentDidUpdate(prevProps) {
    // clear flash messages if the route changes, except if going to
    // mentorship, which is meant to load with it's own flash message
    if (this.props.location.pathname === '/dashboard/mentorship') return;
    else if (prevProps.location.pathname !== this.props.location.pathname) {
      this.props.clearFlashMessage();
    }
  }

  render() {
    const { url } = this.props.match;
    return (
      <div id="appContainer">
        { this.props.username &&
          <Switch>
            <Route exact path={`${url}/`} component={Landing}/>
            <Route exact path={`${url}/preferences`} component={Profile_Config}/>
            <Route exact path={`${url}/profile/:username`} component={Profile_Public}/>
            <Route exact path={`${url}/community`} component={Community}/>
            <Route exact path={`${url}/mentorship`} component={Mentorship}/>
            <Route exact path={`${url}/chat`} component={Chat}/>
            <Route exact path={`${url}/chat/:username`} component={Chat}/>
            <Route exact path={`${url}/account`} component={Account}/>
            <Route component={CatchAll} />
          </Switch> }
      </div>
    );
  }
};

AppContainer.propTypes = {
  saveUser: propTypes.func.isRequired,
  username: propTypes.string.isRequired,
  populateChat: propTypes.func.isRequired,
  addFlashMessage: propTypes.func.isRequired,
  clearFlashMessage: propTypes.func.isRequired,
  populateCommunity: propTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    username: state.user.username,
    chat: state.chat.size > 0 ? true : false,
    community: state.privateChat.size > 0 ? true : false,
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
