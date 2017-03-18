import React from 'react';
import { connect } from 'react-redux';
import ChatMessages from './Chat';
import {
  socket,
  addMessage,
  saveEdit,
  likeMessage,
  broadcastEdit
} from '../../../actions/chat';

class ChatController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      messages: [],
      edit: null
    }
  }
  setEdit = (id) => {
    if (this.state.edit) this.props.broadcastEdit(this.state.edit);
    this.setState({ edit: id });
  }
  finishEdit = (event) => {
    event.preventDefault();
    this.props.broadcastEdit(this.state.edit);
    this.setState({ edit: null });
  }
  handleChange = (e) => this.setState({ input: e.target.value });
  submitMessage = (e) => {
    e.preventDefault();
    const { input } = this.state;
    this.setState({ input: '' });
    this.props.addMessage({ author: this.props.user, text: input });
  }
  render() {
    return (
      <div className="ui container segment" id="chat">
        <div>
          <div className="ui comments">
            <h2 className="ui dividing header">Recent Messages:</h2>
            <ChatMessages
              edit={this.state.edit}
              setEdit={this.setEdit}
              saveEdit={this.props.saveEdit}
              finishEdit={this.finishEdit}
              like={this.props.likeMessage}
              user={this.props.user}
              chat={this.props.chat} />
          </div>
        </div>
        <form className="ui form" onSubmit={this.submitMessage}>
          <input
            type="text"
            placeholder="Type a message here..."
            value={this.state.input}
            onChange={this.handleChange} />
          <button className="ui blue button" onClick={this.submitMessage}>Submit Message</button>
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
};

const dispatch = {
  addMessage,
  saveEdit,
  likeMessage,
  broadcastEdit
};

export default connect(mapStateToProps, dispatch)(ChatController);
