import React from 'react';

const UserLabel = ({ color, size, image, username, label, folder, toggleAll, showAvatar }) => {
  if (!image) {
    image = '/images/defaultAvatar.gif';
  }
  return (
    <div className={`ui image label ${color} ${size}`}>
      { showAvatar && <img src={image} alt="user avatar" /> }
      {username}
      { label && <div className="detail">{label}</div> }
      {
        (typeof folder === 'boolean') &&
        <div
          onClick={toggleAll}
          className="detail folderDetail">
          {folder ? <i className="folder open icon"></i> : <i className="folder icon"></i>}
        </div>
      }
    </div>
  );
}

UserLabel.propTypes = {
  size: React.PropTypes.string,
  label: React.PropTypes.string,
  color: React.PropTypes.string,
  toggleAll: React.PropTypes.func,
  showAvatar: React.PropTypes.bool,
  image: React.PropTypes.string,
  username: React.PropTypes.string.isRequired,
  folder: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool
  ])
}

UserLabel.defaultProps = {
  label: '',
  folder: '',
  color: 'teal',
  size: 'medium',
  showAvatar: true,
}

export default UserLabel;

// EXAMPLE USAGE (Semantic UI classNames)

// <UserLabel
//   label="Contributor"
//   username={username}
//   size="huge"
//   image={avatarUrl}
// />
//
// only specify color & size if diff from default

// OR:

// <UserLabel
//   label="Contributor"
//   username={username}
//   size="huge"
//   image={avatarUrl}
//   folder={this.state.showAll}
//   toggleAll={this.toggleAll}
// />
