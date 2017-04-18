import React from 'react';

class HomePage extends React.Component {
  render() {
    return (
      <div className="ui container App">
        <img src="/images/fcc_hands_in_logo.svg" className="App-logo" alt="'hands in' fcc alumni network logo" />
        <h2>Welcome to the freeCodeCamp Alumni Network</h2>
        <div className="container">
          <div style={{ fontSize: 16 }}>An extension of the freeCodeCamp community</div>
        </div>
      </div>
    );
  }
}

export default HomePage;
