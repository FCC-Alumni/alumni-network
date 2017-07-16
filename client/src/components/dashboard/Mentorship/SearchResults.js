import propTypes from 'prop-types';
import React from 'react';
import { ThickPaddedBottom } from '../../../styles/style-utils';
import UserCard from './UserCard';

const SearchResults = ({
  currentUser,
  handleClick,
  initiatePrivateChat,
  noResults,
  results,
}) => {
  const listResults = results.map(user => {
    return (
      <UserCard
        currentUser={currentUser}
        handleClick={handleClick}
        initiatePrivateChat={initiatePrivateChat}
        key={user._id}
        user={user} />
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
