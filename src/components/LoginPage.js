import React from 'react';

const LoginPage = () => {
  return (
    <div className="ui container">
      <div className="ui center aligned segment">
        <h2>Please Login Using GitHub</h2>
        
        <a className="ui button" href="http://localhost:8080/auth/github"><i className="icon github"/> Github</a>
        
        <h4>This app requires freeCodeCamp and GitHub credentials.</h4>
        <h4>To signup, you must have earned at least one freeCodeCamp certification.</h4>
      </div>
      
    </div>
  )
}

export default LoginPage;
