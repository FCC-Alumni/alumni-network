import React from 'react';
import ReactEmoji from 'react-emoji';

const parseTime = (timestamp) => {
  let a = new Date(timestamp);
  let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  let hour = a.getHours();
  let min = a.getMinutes();
  let sec = a.getSeconds();
  let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
};

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
        {chat.map(msg => {
          const id = msg.get('id');
          const timestamp = msg.get('timestamp');
          const text = msg.get('text');
          const author = msg.get('author');
          const avatar = msg.get('avatar');
          const likes = msg.get('likes');
          const edited = msg.get('edited');
          return (
            <div className="comment" key={id} style={{ paddingTop: '12px' }}>

              <a className="avatar-tooltip avatar" onClick={() => history.replace(`/dashboard/profile/${author}`)}>
                <img src={avatar} alt={`${author}'s Avatar'`} />
                <span className="avatar-tooltiptext">View my profile!</span>
              </a>

              <div className="content">

                { path && author !== user.username ?
                  <span
                    onClick={initiatePrivateChat.bind(this, author)}
                    className='tooltip author author-link'>
                    {author}
                    <span className="tooltiptext">Chat with me!</span>
                    {mentors.has(author) && <i className="student icon mentorIcon"></i>}
                    {onlineStatus.has(author) && <i className="star icon onlineIcon"></i>}
                  </span>
                    :
                  <span className='author author-link-inactive'>
                    {author}
                    {mentors.has(author) && <i className="student icon mentorIcon"></i>}
                    {onlineStatus.has(author) && <i className="star icon onlineIcon"></i>}
                  </span> }

                <div className="metadata">
                  <span className="date">at
                    <span className="timeStamp"> {parseTime(timestamp)} </span>
                  </span>
                  {user.username === author &&
                    <span className='editButton' onClick={setEdit.bind(this, id)}>edit</span>}
                </div>

                {edit === id ?

                <form
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
                  {editText === text ?
                  <button style={{ width: '140px' }} className="ui orange button" onClick={finishEdit}>
                    Cancel
                  </button> :
                  <button style={{ width: '140px' }} className="ui green button" disabled={!editText} onClick={finishEdit}>
                    Save Message
                  </button>}
                  <button className="ui red button" onClick={deleteMessage.bind(this, id)}>Delete Message</button>
                </form>

                :

                <div
                  className="text"
                  style={{ marginTop: '4px' }}>

                  { ReactEmoji.emojify(text) }

                </div>}

                <div className="ui feed" style={{ marginTop: '0px' }}>
                  <div className="event">
                    <div className="content">
                      <div className="meta">
                        {!likes.has(user.username) ?
                          <a className="like" onClick={like.bind(this, id, user.username, recipient)}>
                            <i className="like icon"></i> {likes.size} {likes.size === 1 ? 'Like' : 'Likes'}
                          </a>
                            :
                          <a className="like">
                            <i className="like icon" style={{ color: 'red' }}></i> {likes.size} {likes.size === 1 ? 'Like' : 'Likes'}
                          </a>}
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
        <b>There are no messages yet... why not add one?</b>
      </div>
    );
  }
};
