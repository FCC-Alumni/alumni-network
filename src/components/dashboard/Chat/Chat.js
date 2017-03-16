import React from 'react';

const Chat = (props) => {
  return (
    <div>
      {props.chat.map(msg => {
        return (
          <div className="comment" key={msg.message + Math.random()}>
            <a className="avatar">
              <img src={props.user.avatarUrl}/>
            </a>
            <div className="content">
              <a className="author">{msg.author}</a>
              <div className="metadata">
                <span className="date">Today at {Date.now()}</span>
              </div>
              <div className="text">
                {msg.message}
              </div>
              <div className="actions">
                <a className="reply">Reply</a>
              </div>
            </div>
          </div>
          )
        })
      }
    </div>
  );
};

export default Chat;
