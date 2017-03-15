import React from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { saveUser } from '../actions/loginActions';
import { addFlashMessage } from '../actions/flashMessages';

import Landing from './dashboard/Landing';
import Profile from './dashboard/Profile';
import Community from './dashboard/Community';
import Mentorship from './dashboard/Mentorship';
import Chat from './dashboard/Chat';

const checkSession = () => {
  return axios.get('/api/user').then(res => res.data)
    .catch(e => console.log(e));
}

class AppContainer extends React.Component {
  componentDidMount() {
    checkSession().then(user => {
      if (user) {
        this.props.saveUser(user);
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
    username: state.user.username
  }
}

export default connect(mapStateToProps, { saveUser, addFlashMessage })(AppContainer);
