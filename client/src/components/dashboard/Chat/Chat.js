import React from 'react';
import ReactEmoji from 'react-emoji';
import { Popup } from 'semantic-ui-react';
import parseTime from '../../../assets/helpers/parseTime';

export default ({
  path,
  like,
  chat,
  user,
  edit,
  history,
  mentors,
  setEdit,
  saveEdit,
  editText,
  finishEdit,
  recipient,
  onlineStatus,
  deleteMessage,
  initiatePrivateChat }) => {
  if (chat.size > 0) {
    return (
      <div className='chatMessage'>
        { chat.map(msg => {
          const id = msg.get('id');
          const text = msg.get('text');
          const likes = msg.get('likes');
          const author = msg.get('author');
          const edited = msg.get('edited');
          const avatar = msg.get('avatar');
          const timestamp = msg.get('timestamp');
          return (
            <div className="comment" key={id} style={{ paddingTop: '12px' }}>

              <Popup
                inverted
                position="left center"
                trigger={
                  <a className="avatar" onClick={() => history.replace(`/dashboard/profile/${author}`)}>
                    <img src={avatar} alt={`${author}'s Avatar'`} />
                  </a>}>
                View my profile!
              </Popup>

              <div className="content">
            { path && author !== user.username
              ? <Popup
                  inverted
                  position="top left"
                  trigger={
                    <span
                      onClick={initiatePrivateChat.bind(this, author)}
                      className='author author-link'>
                      {author}
                      {mentors.has(author) && <i className="student icon mentorIcon" />}
                      {onlineStatus.has(author) && <i className="star icon onlineIcon" />}
                    </span>}>
                  Chat with me!
                </Popup>
              : <span className='author author-link-inactive'>
                  {author}
                  {mentors.has(author) && <i className="student icon mentorIcon" />}
                  {onlineStatus.has(author) && <i className="star icon onlineIcon" />}
                </span> }

                <div className="metadata">
                  <span className="date">at
                    <span className="timeStamp"> {parseTime(timestamp)} </span>
                  </span>
                { user.username === author &&
                  <span className='editButton' onClick={setEdit.bind(this, id)}>
                    edit
                  </span> }
                </div>

            { edit === id
              ? <form
                  className="ui form"
                  style={{ marginTop: '10px' }}
                  onSubmit={finishEdit}>
                  <input
                    autoFocus
                    type="text"
                    id="editInput"
                    autoComplete="off"
                    value={editText}
                    onChange={saveEdit.bind(this)}
                    placeholder="You should really type something..." />
              { editText === text
                ? <button
                    onClick={finishEdit}
                    className="ui yellow button"
                    style={{ width: '140px', color: 'black' }}>
                    Cancel
                  </button>
                : <button
                    disabled={!editText}
                    onClick={finishEdit}
                    style={{ width: '140px' }}
                    className="ui green button" >
                    Save Message
                  </button> }
                  <button className="ui red button" onClick={deleteMessage.bind(this, id)}>
                    Delete Message
                  </button>
                </form>
              : <div
                  className="text"
                  style={{ marginTop: '4px' }}>
                  { ReactEmoji.emojify(text) }
                </div> }

                <div className="ui feed" style={{ marginTop: '0px' }}>
                  <div className="event">
                    <div className="content">
                      <div className="meta">
                    { !likes.has(user.username)
                      ? <a className="like" onClick={like.bind(this, id, user.username, recipient)}>
                          <i className="like icon"></i> {likes.size} {likes.size === 1 ? 'Like' : 'Likes'}
                        </a>
                      : <a className="like">
                          <i className="like icon" style={{ color: 'red' }}></i> {likes.size} {likes.size === 1 ? 'Like' : 'Likes'}
                        </a> }
                        {edited && <span>edited</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )
          })
        }
      </div>
    );
  } else {
    return (
      <div>
        <strong>There are no messages yet... why not add one?</strong>
      </div>
    );
  }
};
