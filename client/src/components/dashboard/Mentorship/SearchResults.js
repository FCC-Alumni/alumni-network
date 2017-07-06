import propTypes from 'prop-types';
import React from 'react';
import { ThickPaddedBottom } from '../../../styles/style-utils';
import UserCard from './UserCard';

const SearchResults = ({
<<<<<<< 0f5c92c7cb73056e3aedd0a775f3d72099ddb2e4
=======
  results,
  noResults,
>>>>>>> remove chat from codebase
  currentUser,
  handleClick,
  initiatePrivateChat,
  noResults,
  results,
}) => {
  const listResults = results.map(user => {
<<<<<<< 0f5c92c7cb73056e3aedd0a775f3d72099ddb2e4
    return (
      <UserCard
        currentUser={currentUser}
        handleClick={handleClick}
        initiatePrivateChat={initiatePrivateChat}
        key={user._id}
        user={user} />
=======
    const { username, mentorship: { isMentor, mentorshipSkills }, personal: { bio } } = user;
    return (
      <ResultItem key={user._id} className="item">
        <div className="ui tiny image">
          <IMG
            src={user.personal.avatarUrl}
            alt={`${username}'s avatar`}
            onClick={() => handleClick(user)}
            title={`View ${username}'s profile`} />
        </div>
        <div className="content">
          <Username
            className="header"
            onClick={() => handleClick(user)}
            title={`View ${username}'s profile`}>
            {username}
          </Username>
        { currentUser !== username &&
          <ChatIcon
            className="comments icon"
            title={`Start a Gitter chat with ${username}`}
            onClick={() => initiatePrivateChat(username)} /> }
          <div className="meta">
            <span><strong>{user.personal.displayName}</strong></span>
            <i className="angle double right icon" />
            <span>{isMentor ? 'Mentor' : 'Member'}</span>
          </div>
          <div className="description">
            { isMentor ? mentorshipSkills : bio ? bio : 'User has not yet created a bio' }
          </div>
        </div>
      </ResultItem>
>>>>>>> remove chat from codebase
    );
  });

  const noResultsMessage = (
    <div className="item">
      <div className="ui tiny image">
        <i className="huge green warning circle icon" />
      </div>
      <div className="middle aligned content">
        <div className="header">
          {'Sorry, no results.'}
        </div>
      </div>
    </div>
  );

  return (
    <ThickPaddedBottom className="ui divided items">
      { !noResults ? listResults : noResultsMessage }
    </ThickPaddedBottom>
  );
}

SearchResults.propTypes = {
  currentUser: propTypes.string.isRequired,
  handleClick: propTypes.func.isRequired,
  initiatePrivateChat: propTypes.func.isRequired,
  noResults: propTypes.bool.isRequired,
  results: propTypes.array.isRequired,
}

export default SearchResults;
