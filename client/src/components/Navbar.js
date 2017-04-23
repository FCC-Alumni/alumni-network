import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { darkGreen } from '../styles/globalStyles';
import { connectScreenSize } from 'react-screen-size';

import { APP_HOST } from '../actions/chat';

const Logo = styled.img`
  margin-right: 10px !important;
`;

const MenuRight = styled.div`
  display: flex;
  flex-direction: row;
`;

class NavBar extends React.Component {
  state = {
    nav: this.props.screen.isDesktop,
    clientWidth: ''
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.setState({ clientWidth: window.innerWidth });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = (e) => {
    if (e.target.innerWidth <= 770 && e.target.innerWidth >= 601)
      this.setState({ nav: false });
    else if (e.target.innerWidth > 770)
      this.setState({ nav: true });
    this.setState({ clientWidth: e.target.innerWidth });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.screen.isDesktop) {
      this.setState({ nav: true });
    }
    if (nextProps.screen.isTablet) {
      this.setState({ nav: true });
    }
    if (nextProps.screen.isMobile) {
      this.setState({ nav: false });
    }
  }

  toggleNav = () => {
    if (!this.props.screen.isDesktop) {
      this.setState({ nav: !this.state.nav });
    }
  }

  render() {

    /* NOTE: the NavBar rendering logic is pretty arbitrarily contrived
     around the React screen-size package's props and Semantic UI's menu
     in order to provide the correct responsiveness. The logic is not ideal
     but works pretty well for all screen sizes.
    */

    const { isMobile, isTablet, isDesktop } = this.props.screen;

    var TITLE = isTablet ? 'fCC' : 'freeCodeCamp';
    TITLE += ' Alumni Network';

    const guestNav = (
      <div className={`ui huge fixed stackable inverted borderless ${darkGreen} menu`}>
        <NavLink className="item" activeClassName="item active" exact to="/"><Logo src="/images/fcc_high_five_logo.svg" />freeCodeCamp Alumni Network</NavLink>
        <div className="right menu" id={!isDesktop && 'navMenu'}>
          <MenuRight>
            <NavLink className="item" activeClassName="item active" exact to="/about">About</NavLink>
            <NavLink className="item" activeClassName="item active" exact to="/login">Login</NavLink>
          </MenuRight>
        </div>
      </div>
    );

    const userNav = (
      <div>
      { !this.state.nav
      ? <div className={`ui huge fixed stackable inverted borderless ${darkGreen} menu`}>
          <div className="item" onClick={this.toggleNav}><Logo src="/images/fcc_high_five_logo.svg" />{TITLE}</div>
        </div>

      : <div className={`ui huge fixed stackable inverted borderless ${darkGreen} menu`}>

      { (isDesktop || (isTablet && this.state.clientWidth > 770))
        ? <NavLink className="item" activeClassName="active item" exact to="/dashboard">
            <Logo src="/images/fcc_high_five_logo.svg" />
            {TITLE}
          </NavLink>
        : <div>
            <div className="item" onClick={this.toggleNav}>
              <Logo src="/images/fcc_high_five_logo.svg" />
              {TITLE}
            </div>
            <NavLink className="item" activeClassName="active item" exact to="/dashboard">Dashboard</NavLink>
          </div> }
          <NavLink className="item" activeClassName="active item" exact to="/dashboard/preferences">Profile</NavLink>
          <NavLink className="item" activeClassName="active item" exact to="/dashboard/community">Community</NavLink>
          <NavLink className="item" activeClassName="active item" exact to="/dashboard/mentorship">Mentorship</NavLink>
          <NavLink className="item" activeClassName="active item" exact to="/dashboard/chat">Mess Hall</NavLink>

        { isDesktop &&
          <div className='menu right'>
            <NavLink className="item" activeClassName="active item" exact to="/dashboard/account">
              {!isMobile ? <i className="setting icon"></i> : 'Account'}
            </NavLink>
            <a className="item" href={`${APP_HOST}/logout`}>Logout</a>
          </div> }

        { !isDesktop &&
          <NavLink title={isTablet && 'Account'} className="item" activeClassName="active item" exact to="/dashboard/account">
            {isTablet ? <i className="setting icon" /> : 'Account'}
          </NavLink> }
        { !isDesktop &&
          <a title={isTablet && 'Logout'} className={isTablet ? 'item right' : 'item'} href={`${APP_HOST}/logout`}>
            {isTablet ? <i className="sign out icon" /> : 'Logout'}
          </a> }
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
