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

const findUser = (community, username) => {
  return community.filter(user =>
    (user.username === username) && user)[0];
};

const mapStateToProps = ({ community }, props) => {
  const { username } = props.match.params;
  return {
    user: findUser(community.toJS(), username)
  }
}

export default connect(mapStateToProps)(PublicProfile);
