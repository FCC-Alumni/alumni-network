import React from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { populateCommunity } from '../actions/community';
import { saveUser, getUserData, verifyUser } from '../actions/user';
import { addFlashMessage } from '../actions/flashMessages';

import Landing from './dashboard/Landing';
import Profile from './dashboard/Profile';
import Community from './dashboard/Community';
import Mentorship from './dashboard/Mentorship';
import Chat from './dashboard/Chat/ChatController';

class AppContainer extends React.Component {

  componentDidMount() {
    getUserData().then(user => {
      if (user) {
        this.props.saveUser(user);
        this.props.populateCommunity();
      } else {
        this.props.addFlashMessage({
          type: 'error',
            text: {
              header: 'Access forbiden!',
              message: 'Please signup and/or login to view this page.'
            }
          });
        this.props.history.push('/login');
      }
    });
  }

  render() {
    return (
      <div>
        { this.props.username &&
          <div>
            <Route exact path={`${this.props.match.url}/`} component={Landing}/>
            <Route exact path={`${this.props.match.url}/profile`} component={Profile}/>
            <Route exact path={`${this.props.match.url}/community`} component={Community}/>
            <Route exact path={`${this.props.match.url}/mentorship`} component={Mentorship}/>
            <Route exact path={`${this.props.match.url}/chat`} component={Chat}/>
          </div>
        }
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    username: state.user.get('username')
  }
}

export default connect(mapStateToProps, { saveUser, addFlashMessage, populateCommunity })(AppContainer);
