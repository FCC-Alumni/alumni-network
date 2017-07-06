<<<<<<< 0f5c92c7cb73056e3aedd0a775f3d72099ddb2e4
import { APP_HOST } from '../actions/chat';
=======
import APP_HOST from '../assets/helpers/defineHost';
import React from 'react';
import propTypes from 'prop-types';
>>>>>>> remove chat from codebase
import { connect } from 'react-redux';
import { connectScreenSize } from 'react-screen-size';
<<<<<<< 0f5c92c7cb73056e3aedd0a775f3d72099ddb2e4
import { darkGreen } from '../styles/style-utils';
import { Dropdown } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import propTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
=======

>>>>>>> remove chat from codebase

const Logo = styled.img`
  margin-right: 10px !important;
`;

const MenuRight = styled.div`
  display: flex;
  flex-direction: row;
`;

const Nav = styled.div`
  box-shadow: -1px 0 5px black !important;
  min-height: 60px !important;
`;

class NavBar extends React.Component {
  state = {
    clientWidth: '',
    nav: this.props.screen.isDesktop
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
    if (nextProps.screen.isDesktop || nextProps.screen.isTablet)
      this.setState({ nav: true });
    if (nextProps.screen.isMobile)
      this.setState({ nav: false });
  }

  toggleNav = () => {
    if (!this.props.screen.isDesktop) {
      this.setState({ nav: !this.state.nav });
    }
  }

  navigate = (e) => {
    if (e.target.id === 'dropdownPreferencesLink') {
      this.props.history.push('/dashboard/preferences');
    } else {
      this.props.history.push(`/dashboard/profile/${this.props.user.username}`);
    }
  }

  render() {

    /* NOTE: the NavBar rendering logic is pretty arbitrarily contrived
     around the react-screen-size package's props and Semantic UI's menu
     in order to provide the correct responsiveness. The logic is not ideal
     but works pretty well for all screen sizes.
    */

    const { isMobile, isTablet, isDesktop } = this.props.screen;

    var TITLE = isTablet ? 'fCC' : 'freeCodeCamp';
    TITLE += ' Alumni Network';

    const NAV_CLASS_NAMES =
      `ui huge fixed stackable inverted borderless ${darkGreen} menu `;

    const guestNav = (
      <Nav className={NAV_CLASS_NAMES}>
        <NavLink
          activeClassName="item active"
          className="item"
          exact to="/">
          <Logo src="/images/fcc_high_five_logo.svg" />
          {'freeCodeCamp Alumni Network'}
        </NavLink>
        <div className="right menu" id={!isDesktop && 'navMenu'}>
          <MenuRight>
            <NavLink
              activeClassName="item active"
              className="item"
              exact to="/about">
              {'About'}
            </NavLink>
            <NavLink
              activeClassName="item active"
              className="item"
              exact to="/login">
              {'Login'}
            </NavLink>
          </MenuRight>
        </div>
      </Nav>
    );

    const userNav = (
      <div>
    { !this.state.nav
      ? <Nav className={NAV_CLASS_NAMES}>
          <div className="item" onClick={this.toggleNav}>
            <Logo src="/images/fcc_high_five_logo.svg" />
            {TITLE}
          </div>
        </Nav>
      : <Nav className={NAV_CLASS_NAMES + ' fcc-alumni-nav'}>
      { (isDesktop || (isTablet && this.state.clientWidth > 770))
        ? <NavLink
            activeClassName="active item"
            className="item"
            exact to="/dashboard">
            <Logo src="/images/fcc_high_five_logo.svg" />
            {TITLE}
          </NavLink>
        : <div>
            <div className="item" onClick={this.toggleNav}>
              <Logo src="/images/fcc_high_five_logo.svg" />
              {TITLE}
            </div>
            <NavLink
              activeClassName="active item"
              className="item"
              exact to="/dashboard">
              {'Dashboard'}
            </NavLink>
          </div> }

          <Dropdown className="item" text="Profile">
            <Dropdown.Menu>
              <Dropdown.Item
                id="dropdownPreferencesLink"
                onClick={this.navigate}>
                {'Preferences'}
              </Dropdown.Item>
              <Dropdown.Item
                id="dropdownProfileLink"
                onClick={this.navigate}>
                {'Public'}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <NavLink
            activeClassName="active item"
            className="item"
            exact to="/dashboard/community">
            {'Community'}
          </NavLink>

          <NavLink
            activeClassName="active item"
            className="item"
            exact to="/dashboard/mentorship">
            {'Mentorship'}
          </NavLink>

          <NavLink
            activeClassName="active item"
            className="item"
            exact to="/dashboard/chat">
            {'Mess Hall'}
          </NavLink>

        { isDesktop &&
          <div className='menu right'>
            <NavLink
              activeClassName="active item"
              className="item"
              exact to="/dashboard/account">
              {!isMobile ? <i className="setting icon" /> : 'Account'}
            </NavLink>
            <a className="item" href={`${APP_HOST}/logout`}>
              {'Logout'}
            </a>
          </div> }

        { !isDesktop &&
          <NavLink
            activeClassName="active item"
            className="item"
            exact
            title={isTablet && 'Account'}
            to="/dashboard/account">
            {isTablet ? <i className="setting icon" /> : 'Account'}
          </NavLink> }
        { !isDesktop &&
          <a
            className={isTablet ? 'item right' : 'item'}
            href={`${APP_HOST}/logout`}
            title={isTablet && 'Logout'}>
            {isTablet ? <i className="sign out icon" /> : 'Logout'}
          </a> }
        </Nav> }
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
  screen: propTypes.object.isRequired,
  user: propTypes.object.isRequired,
}

export const mapScreenSizeToProps = (screenSize) => {
  return { screen: {
    isDesktop: screenSize['> small'],
    isMobile: screenSize['mobile'],
    isTablet: screenSize['small'],
  }};
}

export default connectScreenSize(mapScreenSizeToProps)(
  connect(mapStateToProps)(NavBar));
