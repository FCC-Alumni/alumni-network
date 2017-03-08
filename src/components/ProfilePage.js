import React from 'react';
import { connect } from 'react-redux';

class ProfilePage extends React.Component {
  render() {
    return (
      <div className="ui container">
        <div className="ui center aligned segment">
          <h1>Profile Page</h1>
          {/* just to show data is now in store */}
          <h4>{this.props.user.username}</h4>
          <p>Verified User</p><p>{this.props.user.verifiedUser}</p>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user[0]
  }
}

ProfilePage.propTypes = {
  user: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps)(ProfilePage);