import { connect } from 'react-redux';
import { connectScreenSize } from 'react-screen-size';
import { mapScreenSizeToProps } from '../Navbar';
import React from 'react';
import styled from 'styled-components';
import UserCard from './Community/UserCard';

class Community extends React.Component {
  render() {
    const { screen } = this.props;
    const Wrapper = screen.isMobile
      ? styled.div`
        padding: 0 12vw 5vh 12vw;
      `
      : styled.div`
        padding: 0 7vw 5vh 7vw;
      `;
    return (
      <Wrapper>
        <div className={`ui ${screen.isMobile
          ? 'stackable'
          : screen.isTablet
          ? 'three'
          : 'five'} cards`}>
          { this.props.community.map(user => {
            return (
              <UserCard
                history={this.props.history}
                key={user._id}
                user={user}
              />
            );
          })}
        </div>
      </Wrapper>
    );
  }
};

export default connectScreenSize(mapScreenSizeToProps)(
  connect(state => ({ community: state.community }))(Community));
