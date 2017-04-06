import React from 'react';
import './styles/App.css';
import { Route } from 'react-router-dom';
import NavBar from './components/Navbar';
import HomePage from './components/HomePage';
import AppContainer from './components/AppContainer';
import LoginPage from './components/signup/LoginPage';
import '../node_modules/flag-icon-css/css/flag-icon.css';
import PassportPage from './components/signup/PassportPage';
import FlashMessagesList from './components/flash/FlashMessagesList';

const App = () => {
  return (
    <div>

      <Route path="/" component={NavBar} />
      <FlashMessagesList />

      <Route exact path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/verify_account" component={PassportPage} />

      <Route path="/dashboard" component={AppContainer} />

    </div>
  );
}

export default App;
