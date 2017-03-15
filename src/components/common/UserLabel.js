import React from 'react';

const UserLabel = ({ color, size, image, username, label, folder, toggleAll }) => {
  if (!image) {
    image = '/images/defaultAvatar.gif';
  }
  return (
    <div className={'ui image label ' + color + ' ' + size}>
      <img src={image} alt="user avatar" />
      {username}
      <div className="detail">{label}</div>
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
  color: React.PropTypes.string,
  size: React.PropTypes.string,
  image: React.PropTypes.string.isRequired,
  username: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
}

UserLabel.defaultProps = {
  color: 'teal',
  size: 'medium',
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
