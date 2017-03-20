import React from 'react';
import { connect } from 'react-redux';

class Community extends React.Component {
  render() {
    return (
      <div className="ui container community">
        <h1>
          This is the Community:
        </h1>
        {this.props.users.map(user => {
          return (
            <div className='ui card'>
              <h1>{user.username}</h1>
            </div>
          );
        })}
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
