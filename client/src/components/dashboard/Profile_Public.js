import React from 'react';
import { connect } from 'react-redux';

class PublicProfile extends React.Component {
  render() {
    const { user } = this.props;
    return (
      <div>
        <h1 className="text-align-center">{`${user.username}'s Public Profile`}</h1>
        <img style={{ margin: 'auto' }} className="ui big image" src={user.personal.avatarUrl} alt={`${user.username}'s avatar`} />
      </div>
    );
  }
}

PublicProfile.propTypes = {
  user: React.PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    user: state.viewUser
  }
}

export default connect(mapStateToProps)(PublicProfile);
