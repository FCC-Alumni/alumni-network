import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { connectScreenSize } from 'react-screen-size';

import { APP_HOST } from '../actions/chat';

const Logo = styled.img`
  margin-right: 10px !important;
`;

class NavBar extends React.Component {
  state = {
    nav: this.props.screen.isDesktop
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.screen.isDesktop !== this.state.nav) {
      this.setState({ nav: !this.state.nav });
    }
  }

  toggleNav = () => {
    if (!this.props.screen.isDesktop) {
      this.setState({ nav: !this.state.nav });
    }
  }

  render() {
    const guestNav = (
      <div className="ui huge fixed stackable inverted borderless green menu">
        <NavLink className="item" activeClassName="item active" exact to="/"><Logo src="/images/fcc_high_five_logo.svg" />freeCodeCamp Alumni Network</NavLink>
        <div className="right menu">
          <NavLink className="item" activeClassName="item active" exact to="/login">Login</NavLink>
        </div>
      </div>
    );

    const userNav = (
      <div>
        {!this.state.nav ?
          <div className="ui huge fixed stackable inverted borderless green menu">
            <div className="item" onClick={this.toggleNav}><Logo src="/images/fcc_high_five_logo.svg" />freeCodeCamp Alumni Network</div>
          </div> :
          <div className="ui huge fixed stackable inverted borderless green menu">
            <div className="item" onClick={this.toggleNav}><Logo src="/images/fcc_high_five_logo.svg" />freeCodeCamp Alumni Network</div>
            <NavLink className="item" activeClassName="active item" exact to="/dashboard">Dashboard</NavLink>
            <NavLink className="item" activeClassName="active item" exact to="/dashboard/preferences">Profile</NavLink>
            <NavLink className="item" activeClassName="active item" exact to="/dashboard/community">Community</NavLink>
            <NavLink className="item" activeClassName="active item" exact to="/dashboard/mentorship">Mentorship</NavLink>
            <NavLink className="item" activeClassName="active item" exact to="/dashboard/chat">Mess Hall</NavLink>
            <div className="right menu">
              <a className="item" href={`${APP_HOST}/logout`}>Logout</a>
            </div>
          </div> }
      </div>
    );
    return (
      <div>
        { this.props.user.verifiedUser ? userNav : guestNav }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

NavBar.propTypes = {
  user: propTypes.object.isRequired,
  screen: propTypes.object.isRequired
}

export const mapScreenSizeToProps = (screenSize) => {
  return { screen: {
    isTablet: screenSize['small'],
    isMobile: screenSize['mobile'],
    isDesktop: screenSize['> small']
  }};
}

export default connectScreenSize(mapScreenSizeToProps)(
  connect(mapStateToProps)(NavBar));
