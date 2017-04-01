import React from 'react';
import { APP_HOST } from '../../actions/chat';

const LoginPage = () => {
  return (
    <div className="ui center aligned grid">
      <div id="login-form" className="six wide column">

        <div className="ui segment">
          <h2 className="ui teal image header">
            <i className="huge github icon"/>
            <div className="content">Login with GitHub</div>
          </h2>

          <div className="ui segment">
            <a className="ui teal button" href={`${APP_HOST}/auth/github`}>Login</a>
          </div>

          <div className="ui teal message">
            <div className="header">Joining the freeCodeCamp Alumni Network requires both freeCodeCamp and GitHub credentials.</div>
          </div>
        </div>


      </div>

      <div className="center aligned segment">
        <i id="arrow-bounce" className="massive teal arrow up icon"/>
      </div>

    </div>
  );
}

export default LoginPage;
