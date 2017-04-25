import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';
import {
  ThickPaddedBottom,
  hoverTransition
} from '../../../styles/globalStyles';

const ResultItem = styled.div`
  width: 45vw !important;
`;

const Username = styled.div`
  ${ hoverTransition() }
`;

const ChatIcon = styled.i`
  ${ hoverTransition() }
  font-size: 20px !important;
  margin-left: 4px !important;
  margin-bottom: 2px !important;
`;

const IMG = styled.img`
  border-radius: 100% !important;
  cursor: pointer;
`;

const SearchResults = ({ privateChat, initiatePrivateChat, currentUser, results, noResults, handleClick }) => {
  const listResults = results.map(user => {
    const { username, mentorship: { isMentor, mentorshipSkills }, personal: { bio } } = user;
    const notifications = privateChat.getIn([username, 'notifications']);
    return (
      <ResultItem key={user._id} className="item">
        <div className="ui tiny image">
          <IMG
            src={user.personal.avatarUrl}
            alt={`${username}'s avatar`}
            onClick={() => { handleClick(user) }}
            title={`View ${username}'s profile`} />
        </div>
        <div className="content">
          <Username
            className="header"
            onClick={() => { handleClick(user) }}
            title={`View ${username}'s profile`}>
            {username}
          </Username>
        { currentUser !== username &&
          <ChatIcon
            className="comments icon"
            title={`Start a chat with ${username}`}
            onClick={ () => { initiatePrivateChat(username, notifications) }} /> }
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
    );
  });

  const noResultsMessage = (
    <div className="item">
      <div className="ui tiny image">
        <i className="huge green warning circle icon" />
      </div>
      <div className="middle aligned content">
        <div className="header">
          Sorry, no results.
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
  initiatePrivateChat: propTypes.func.isRequired,
  currentUser: propTypes.string.isRequired,
  noResults: propTypes.bool.isRequired,
  results: propTypes.array.isRequired,
}

export default SearchResults;
