import React from 'react';
import { connect } from 'react-redux';
import ChatMessages from './Chat';
import { socket } from '../../../actions/chat';

class ChatController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      messages: []
    }
  }
  
  handleChange = (e) => this.setState({ input: e.target.value });
  
  submitMessage = (e) => {
    e.preventDefault();
    const { input: message } = this.state;
    this.setState({ input: '' });
    socket.emit('publish', { author: this.props.user.username, message } );
  }
  
  render() {
    return (
      <div className="ui container segment" id="chat">
        <h2 className="ui dividing header">Recent Messages:</h2>
        <div id="messages-container" className="ui comments">
          <ChatMessages
            user={this.props.user}
            chat={this.props.chat} />
        </div>
        <form className="ui form" onSubmit={this.submitMessage}>
          <input
            type="text"
            placeholder="Type a message here..."
            value={this.state.input}
            onChange={this.handleChange} />
          <button className="ui primary button" type="submit">Submit Message</button>
        </form>
      </div>
    );
  }
};

const mapStateToProps = ({ user, chat }) => {
  return {
    user,
    chat
  }
}

export default connect(mapStateToProps)(ChatController);
