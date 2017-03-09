import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <div className="ui stackable teal pointing menu">
      <NavLink className="item" activeClassName="item active" exact to="/"><i className="fa fa-free-code-camp" />freeCodeCamp Alumni Network</NavLink>
      <NavLink className="item" activeClassName="item active" exact to="/login">Login</NavLink>
    </div>
  )
}