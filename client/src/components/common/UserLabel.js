import React from 'react';
import propTypes from 'prop-types';

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
  size: propTypes.string,
  label: propTypes.string,
  color: propTypes.string,
  toggleAll: propTypes.func,
  showAvatar: propTypes.bool,
  image: propTypes.string,
  username: propTypes.string.isRequired,
  folder: propTypes.oneOfType([
    propTypes.string,
    propTypes.bool
  ])
}

UserLabel.defaultProps = {
  label: '',
  folder: '',
  color: 'green',
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
