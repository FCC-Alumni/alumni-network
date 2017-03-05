import React, { Component } from 'react';
import { loginWithGithub } from '../actions/loginActions';

class LoginPage extends Component {
  render() {
    return (
      <div className="loginComponent">
        <h2>Login</h2>
        
        <div className="ui button">
          <a href="http://localhost:8080/auth/github">Github</a>
        </div>
        
      </div>
    )
  }
}

export default LoginPage;
