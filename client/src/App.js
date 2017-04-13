import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NavBar from './components/Navbar';
import HomePage from './components/HomePage';
import PublicLanding from './components/PublicLanding';
import LoginPage from './components/signup/LoginPage';
import PassportPage from './components/signup/PassportPage';
import FlashMessagesList from './components/flash/FlashMessagesList';
import AppContainer from './components/AppContainer';

import './styles/App.css';
import '../node_modules/flag-icon-css/css/flag-icon.css';

export const CatchAll = () => (
  <div style={{ textAlign: 'center', marginTop: '125px' }}>
    <h1>We couldn't find anything here...</h1>
    <img src="/images/fcc_hands_in_logo.svg" className="App-logo" alt="'hands in' fcc alumni network logo" />
  </div>
);

export default () => {
  return (
    <div>

      <Route path="/" component={NavBar} />
      <FlashMessagesList />

      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/about" component={PublicLanding} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/verify_account" component={PassportPage} />
        <Route path="/dashboard" component={AppContainer} />
        <Route component={CatchAll} />
      </Switch>

    </div>
  );
}
