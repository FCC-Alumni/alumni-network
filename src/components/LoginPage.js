import React from 'react';

const LoginPage = () => {
  return (
    <div className="ui container">
      <div className="ui center aligned segment">
        <h2>Please Login Using GitHub</h2>
        
        <a className="ui button" href="http://localhost:8080/auth/github"><i className="icon github"/> Github</a>
        
        <div className="ui warning message">
          <div className="header">Joining the freeCodeCamp Alumni Network requires both freeCodeCamp and GitHub credentials.</div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
