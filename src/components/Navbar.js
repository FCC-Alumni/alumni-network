import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class NavBar extends React.Component {
  render() {
    const guestNav = (
      <div className="ui stackable teal pointing menu">
        <NavLink className="item" activeClassName="item active" exact to="/"><i className="fa fa-free-code-camp" />freeCodeCamp Alumni Network</NavLink>
        <div className="right menu">
          <NavLink className="item" activeClassName="item active" exact to="/login">Login</NavLink>
        </div>
      </div>
    );
    
    const userNav = (
      <div className="ui stackable teal pointing menu">
        <NavLink className="item" activeClassName="item active" exact to="/"><i className="fa fa-free-code-camp" />freeCodeCamp Alumni Network</NavLink>
        <NavLink className="item" activeClassName="item active" exact to="/dashboard">Dashboard</NavLink>
        <NavLink className="item" activeClassName="item active" exact to="/">Profile</NavLink>
        <NavLink className="item" activeClassName="item active" exact to="/">Interests</NavLink>
        <div className="right menu">
          <a className="item" href="http://localhost:8080/logout">Logout</a>
        </div>
      </div>
    );
    return (
      <div>
        { this.props.user.verifiedUser ? userNav : guestNav }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

NavBar.propTypes = {
  user: React.PropTypes.object.isRequired
}

// export default NavBar;
export default connect(mapStateToProps)(NavBar);