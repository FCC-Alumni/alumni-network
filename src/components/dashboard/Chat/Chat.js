import React from 'react';

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

export default ({ chat, user, setEdit, finishEdit, edit, saveEdit, like }) => {
  if (chat.size > 0) {
    return (
      <div>
        {chat.map(msg => {
          const id = msg.get('id');
          const timestamp = msg.get('timestamp');
          const text = msg.get('text');
          const author = msg.get('author');
          const likes = msg.get('likes');
          return (
            <div className="comment" key={id} style={{ paddingTop: '12px' }}>
              <a className="avatar">
                <img src={user.avatarUrl}/>
              </a>
              <div className="content">
                <a className="author">{author}</a>
                <div className="metadata">
                  <span className="date">at {parseTime(timestamp)}</span>
                  {user.username === author &&
                    <span onClick={setEdit.bind(this, id)}>edit</span>}
                </div>

                {edit === id ?
                <form
                  className="ui form"
                  style={{ marginTop: '10px' }}
                  onSubmit={finishEdit}>
                  <input
                    type="text"
                    placeholder="You should type something..."
                    value={text}
                    onChange={saveEdit.bind(this, edit)} />
                  <button className="ui green button" onClick={finishEdit}>Save Edit</button>
                </form>
                :
                <div
                  className="text"
                  style={{ marginTop: '4px' }}>
                  {text}
                </div>}

                <div className="ui feed" style={{ marginTop: '0px' }}>
                  <div className="event">
                    <div className="content">
                      <div className="meta">
                        {(likes.indexOf(user.username) === -1) ?
                          <a className="like" onClick={like.bind(this, id, user.username)}>
                            <i className="like icon"></i> {likes.length} {likes.length ? 'Like' : 'Likes'}
                          </a>
                            :
                          <a className="like">
                            <i className="like icon"></i> {likes.length} {likes.length ? 'Like' : 'Likes'}
                          </a>}
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
  }
  return null;
};
