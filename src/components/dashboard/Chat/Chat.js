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
}

const Chat = (props) => {
  if (props.chat.size > 0) {
    return (
      <div>
        {props.chat.map(msg => {
          return (
            <div className="comment" key={msg.get('id')} style={{ paddingTop: '12px' }}>
              <a className="avatar">
                <img src={props.user.avatarUrl}/>
              </a>
              <div className="content">
                <a className="author">{msg.get('author')}</a>
                <div className="metadata">
                  <span className="date">at {parseTime(msg.get('timestamp'))}</span>
                </div>
                <div className="text" style={{ marginTop: '4px' }}>
                  {msg.get('text')}
                </div>

                <div className="ui feed" style={{ marginTop: '0px' }}>
                  <div className="event">
                    <div className="content">
                      <div className="meta">
                        <a className="like">
                          <i className="like icon"></i> {msg.get('likes')} Likes
                        </a>
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

export default Chat;
