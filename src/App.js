import React, {Component} from 'react';
import { Route, NavLink } from 'react-router-dom';
import LoginComponent from './components/nav/Login';
import HomePage from './components/navbar/HomePage';
import './styles/App.css';

class App extends Component {
    render() {
        return (
            <div>
                <nav>
                  <div className="nav-wrapper teal">
                      <a href="#">Home</a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                      <a href="#">Login</a>
                    </ul>
                  </div>
                </nav>
                
                <LoginComponent />
                
            </div>
        );
    }
}

export default App;
