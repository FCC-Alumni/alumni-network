import React from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
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
        // refresh page, authenticated route
        if (!user.verifiedUser) {
          console.log('Performing reverification')
          verifyUser(user.username, user._id).then(res => {
            const user = res.data.user;
            this.props.saveUser(user);
          })
        } else {
          console.log('Saving user to redux')
          this.props.saveUser(user);
        } 
      } else {
        // protect authenticated route
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

export default connect(mapStateToProps, { saveUser, addFlashMessage })(AppContainer);
