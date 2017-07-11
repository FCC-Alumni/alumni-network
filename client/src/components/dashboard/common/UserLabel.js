import { isEqual } from 'lodash';
import propTypes from 'prop-types';
import React from 'react';

export default class UserLabel extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }
  render() {
    const { color, size, image, username, label, folder, toggleAll, showAvatar } = this.props;
    return (
      <div className={`ui image label ${color} ${size}`}>
        { showAvatar && <img src={image ? image : '/images/defaultAvatar.gif'} alt="user avatar" /> }
        {username}
        { label && <div className="detail">{label}</div> }
      { (typeof folder === 'boolean') &&
        <div
          onClick={toggleAll}
          className="detail folderDetail">
      { folder
        ? <i className="folder open icon" />
        : <i className="folder icon" /> }
        </div> }
      </div>
    );
  }
}


UserLabel.propTypes = {
  color: propTypes.string,
  folder: propTypes.oneOfType([
    propTypes.string,
    propTypes.bool
  ]),
  image: propTypes.string,
  label: propTypes.string,
  showAvatar: propTypes.bool,
  size: propTypes.string,
  toggleAll: propTypes.func,
  username: propTypes.string.isRequired,
}

UserLabel.defaultProps = {
  color: 'green',
  folder: '',
  label: '',
  showAvatar: true,
  size: 'medium',
}

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
