import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import PassportPage from './components/PassportPage';
import Dashboard from './components/Dashboard';
import NavBar from './components/Navbar';
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
