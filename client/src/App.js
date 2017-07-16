import './styles/App.css';
import '../node_modules/flag-icon-css/css/flag-icon.css';

import AppContainer from './components/AppContainer';
import FlashMessagesList from './components/flash/FlashMessagesList';
import HomePage from './components/HomePage';
import LoginPage from './components/signup/LoginPage';
import NavBar from './components/Navbar';
import PublicLanding from './components/PublicLanding';
import React from 'react';
import UserVerification from './components/signup/UserVerification';

import { Route, Switch } from 'react-router-dom';

export const CatchAll = () => (
  <div style={{ marginTop: '125px', textAlign: 'center' }}>
    <h1>{'We couldn\'t find anything here...'}</h1>
    <img
      alt="'hands in' fcc alumni network logo"
      className="App-logo"
      src="/images/fcc_hands_in_logo.svg" />
  </div>
);

export default () => {
  return (
    <div>
      <Route component={NavBar} path="/" />
      <Route component={FlashMessagesList} path="/" />
      <Switch>
        <Route component={HomePage} exact path="/" />
        <Route component={PublicLanding} exact path="/about" />
        <Route component={LoginPage} exact path="/login" />
        <Route component={UserVerification} exact path="/verify_account" />
        <Route component={AppContainer} path="/dashboard" />
        <Route component={CatchAll} />
      </Switch>
    </div>
  );
}
