import React from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { saveUser } from '../../actions/loginActions';
import { addFlashMessage } from '../../actions/flashMessages';

import Profile from './Profile';
import Community from './Community';
import Account from './Account';

const checkSession = () => {
  return axios.get('/api/user').then(res => res.data)
    .catch(e => console.log(e));
}

class Dashboard extends React.Component {
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
            <Route exact path={`${this.props.match.url}/`} component={Profile}/>
            <Route exact path={`${this.props.match.url}/community`} component={Community}/>
            <Route exact path={`${this.props.match.url}/account`} component={Account}/>
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

export default connect(mapStateToProps, { saveUser, addFlashMessage })(Dashboard);
