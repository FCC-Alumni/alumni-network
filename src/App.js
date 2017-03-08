import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import PassportPage from './components/PassportPage';
import ProfilePage from './components/ProfilePage';
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
            <Route path="/account" component={PassportPage} />
            <Route path="/profile_page" component={ProfilePage} />
            
          </div>
        );
    }
}

export default App;
