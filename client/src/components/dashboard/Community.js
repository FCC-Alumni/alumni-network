import React from 'react';
import { connect } from 'react-redux';

import UserCard from './Community/UserCard';

class Community extends React.Component {
  render() {
    return (
      <div className="community">
        <div className="ui four stackable cards">
          {this.props.users.map(user => {
            return (
              <UserCard key={user._id} user={user} />
            );
          })}
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    users: state.community
  }
}

export default connect(mapStateToProps)(Community);
