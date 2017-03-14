import React from 'react';
import { Route } from 'react-router-dom';
import NavBar from './components/Navbar';
import HomePage from './components/HomePage';
import LoginPage from './components/signup/LoginPage';
import PassportPage from './components/signup/PassportPage';
import Dashboard from './components/dashboard/Dashboard';
import FlashMessagesList from './components/flash/FlashMessagesList';
import './styles/App.css';

class App extends React.Component {
  render() {
    return (
      <div>

        <NavBar />
        <FlashMessagesList />

        <Route exact path="/" component={HomePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/verify_account" component={PassportPage} />

        <Route path="/dashboard" component={Dashboard} />

      </div>
    );
  }
}

export default App;
