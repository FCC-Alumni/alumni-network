import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import PassportPage from './components/PassportPage';
import './styles/App.css';

class App extends React.Component {
    render() {
        return (
          <div>
            
            <div className="ui stackable teal pointing menu">
              <NavLink className="item" activeClassName="item active" exact to="/"><i className="fa fa-free-code-camp" />freeCodeCamp Alumni Network</NavLink>
              <NavLink className="item" activeClassName="item active" exact to="/login">Login</NavLink>
            </div>
            
            <Route exact path="/" component={HomePage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/account" component={PassportPage} />
            
          </div>
        );
    }
}

export default App;
