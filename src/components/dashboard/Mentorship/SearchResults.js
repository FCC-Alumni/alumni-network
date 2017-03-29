import React from 'react';

const SearchResults = ({ initiatePrivateChat, currentUser, results, noResults }) => {

  const listResults = results.map(user => {
    return (
      <div key={user._id} className="item search-result-item">
        <div className="ui tiny circular image">
          <img src={user.personal.avatarUrl} />
        </div>
        <div className="content">
          <div className="header">{user.username}</div>
            { currentUser !== user.username &&
              <i
                className="comments icon chatIcon"
                onClick={ () => { initiatePrivateChat(user.username) }} />
            }
          <div className="meta">
            <span><strong>{user.personal.displayName}</strong></span>
            <i className="angle double right icon" />
            <span>{user.mentorship.isMentor ? 'Mentor' : 'Member'}</span>
          </div>
          <div className="description">
            {user.mentorship.mentorshipSkills}
          </div>
        </div>
      </div>
    );
  });

  const noResultsMessage = (
    <div className="item">
      <div className="ui tiny image">
        <i className="huge teal warning circle icon" />
      </div>
      <div className="middle aligned content">
        <div className="header">
          Bummer man... No results.
        </div>
      </div>
    </div>
  );

  return (
    <div className="ui divided items">
      { !noResults ? listResults : noResultsMessage }
    </div>
  );
}

SearchResults.propTypes = {
  initiatePrivateChat: React.PropTypes.func.isRequired,
  currentUser: React.PropTypes.string.isRequired,
  results: React.PropTypes.array.isRequired,
  noResults: React.PropTypes.bool.isRequired
}

export default SearchResults;
