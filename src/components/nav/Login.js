import React, { Component } from 'react';
import { loginWithGithub } from '../../actions/loginActions';

class LoginComponent extends Component {
  handleClick = () => {
    loginWithGithub();
  }
  render() {
    return (
      <div className="loginComponent">
        <h2>Login</h2>
        
        <button onClick={this.handleClick}>Github</button>
      </div>
    )
  }
}

export default LoginComponent;
