import React from 'react';
import { APP_HOST } from '../../actions/chat';
import { connectScreenSize } from 'react-screen-size';
import { mapScreenSizeToProps } from '../Navbar';
import styled from 'styled-components';

class LoginPage extends React.Component {
  state = { flashMessageCleared: false }
  componentDidMount = () => document.addEventListener('click', this.handleClick);
  componentWillUnmount = () => document.removeEventListener('click', this.handleClick);
  // 'close' is className of close icon in flash message
  handleClick = (e) => e.target.classList.contains('close')
    ? this.setState({ flashMessageCleared: true })
    : this.setState({ flashMessageCleared: false });
  render() {
    const { flashMessageCleared } = this.state;
    const { isTablet, isMobile, isDesktop } = this.props.screen;
    const Container = styled.div`
      margin-top: ${document.getElementsByClassName('flashMessage').length > 0
        && !flashMessageCleared
        ? '53px' : isDesktop
        ? '200px': '175px' } !important;
      `;
    return (
      <Container className={`ui center aligned grid ${isDesktop && 'container'}`}>
        <div className={`${isMobile ? 'twelve' : isTablet ? 'ten' : 'six'} wide column`}>
          <div className="ui segment">
            <h2 className="ui green image header">
              { !isMobile && <i className="huge github icon"/> }
              <div className="content">Login with GitHub</div>
            </h2>
            <div className="ui segment">
              <a className="ui green button" href={`${APP_HOST}/auth/github`}>Login</a>
            </div>
            <div className="ui info message">
              <div className="header">Joining the freeCodeCamp Alumni Network requires both freeCodeCamp and GitHub credentials.</div>
            </div>
          </div>
        { isDesktop &&
          <div className="center aligned segment">
            <i id="arrow-bounce" className="massive green arrow up icon"/>
          </div> }
        </div>
      </Container>
    );
  }
}

export default connectScreenSize(mapScreenSizeToProps)(LoginPage);
