import Account from './dashboard/Account';
import { CatchAll } from '../App';
import Community from './dashboard/Community';
import { connect } from 'react-redux';
import GitterEmbed from './dashboard/GitterEmbed';
import Landing from './dashboard/Landing';
import Mentorship from './dashboard/Mentorship';
import { populateCommunity } from '../actions/community';
import Preferences from './dashboard/Preferences';
import propTypes from 'prop-types';
import PublicProfile from './dashboard/PublicProfile';
import React from 'react';
import { socket } from '../actions/chat';

import { addFlashMessage, clearFlashMessage } from '../actions/flashMessages';
import { fetchPrivateChat, populateChat } from '../actions/chat';
import { getUserData, logoutUser, saveUser } from '../actions/user';
import { Route, Switch } from 'react-router-dom';

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

        // announce this user is now online
        // should refresh status if user reloads page:
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
      console.error(err);
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
            <Route
              component={Landing}
              exact
              path={`${url}/`} />
            <Route
              component={Preferences}
              exact
              path={`${url}/preferences`} />
            <Route
              component={PublicProfile}
              exact
              path={`${url}/profile/:username`} />
            <Route
              component={Community}
              exact
              path={`${url}/community`} />
            <Route
              component={Mentorship}
              exact
              path={`${url}/mentorship`} />
            <Route
              component={GitterEmbed}
              exact
              path={`${url}/chat`} />
            <Route
              component={GitterEmbed}
              exact
              path={`${url}/chat/:username`} />
            <Route
              component={Account}
              exact
              path={`${url}/account`} />
            <Route
              component={CatchAll} />
          </Switch> }
      </div>
    );
  }
};

AppContainer.propTypes = {
  addFlashMessage: propTypes.func.isRequired,
  clearFlashMessage: propTypes.func.isRequired,
  populateChat: propTypes.func.isRequired,
  populateCommunity: propTypes.func.isRequired,
  saveUser: propTypes.func.isRequired,
  username: propTypes.string.isRequired,
}

const mapStateToProps = (state) => {
  return {
    chat: state.chat.size > 0 ? true : false,
    community: state.community.size > 0 ? true : false,
    username: state.user.username,
  }
}

const dispatch = {
  addFlashMessage,
  clearFlashMessage,
  fetchPrivateChat,
  logoutUser,
  populateChat,
  populateCommunity,
  saveUser,
}

export default connect(mapStateToProps, dispatch)(AppContainer);
