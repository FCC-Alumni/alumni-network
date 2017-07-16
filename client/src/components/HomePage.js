import React from 'react';

class HomePage extends React.Component {
  render() {
    return (
      <div className="ui container App">
        <img
          alt="'hands in' fcc alumni network logo"
          className="App-logo"
          src="/images/fcc_hands_in_logo.svg" />
        <h2>{'Welcome to the freeCodeCamp Alumni Network'}</h2>
        <div className="container">
          <div style={{ fontSize: 16 }}>
            {'An extension ofF the freeCodeCamp community'}
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
