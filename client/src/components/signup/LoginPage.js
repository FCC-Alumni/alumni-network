import React from 'react';
import { APP_HOST } from '../../actions/chat';
import { connectScreenSize } from 'react-screen-size';
import { mapScreenSizeToProps } from '../Navbar';

const LoginPage = ({ screen: { isTablet, isMobile, isDesktop }}) => {
  return (
    <div className="ui center aligned grid">
      <div id="login-form" className={`${isMobile ? 'twelve' : isTablet ? 'ten' : 'six'} wide column`}>

        <div className="ui segment">
          <h2 className="ui green image header">
            { !isMobile && <i className="huge github icon"/> }
            <div className="content">Login with GitHub</div>
          </h2>

          <div className="ui segment">
            <a className="ui green button" href={`${APP_HOST}/auth/github`}>Login</a>
          </div>

          <div className="ui info message">
            <div className="header">Joining the freeCodeCamp Alumni Network requires both freeCodeCamp and GitHub credentials.</div>
          </div>
        </div>


      </div>

      { isDesktop &&
        <div className="center aligned segment">
          <i id="arrow-bounce" className="massive green arrow up icon"/>
        </div>
      }

    </div>
  );
}

export default connectScreenSize(mapScreenSizeToProps)(LoginPage);
