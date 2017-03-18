import React from 'react';
import { connect } from 'react-redux';
import ChatMessages from './Chat';
import {
  socket,
  addMessage,
  deleteMessage,
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
      edit: null,
      editText: null
    }
  }
  setEdit = (id) => {
    if (this.state.editText !== '') {
      if (this.state.edit) this.props.broadcastEdit(this.state.edit);
      this.setState({
        edit: id,
        editText: this.props.chat.find(message => message.get('id') === id).get('text')
      });
    }
  }
  deleteMessage = (id) => {
    this.setState({
      edit: null,
      editText: null
    });
    this.props.deleteMessage(id);
  }
  saveEdit = (event) => {
    const editText = event.target.value;
    this.setState({ editText });
    if (editText) {
      this.props.saveEdit(this.state.edit, this.state.editText);
    }
  }
  finishEdit = (event) => {
    event.preventDefault();
    if (this.state.editText) {
      this.props.broadcastEdit(this.state.edit);
      this.setState({
        edit: null,
        editText: null
      });
    }
  }
  handleChange = (e) => this.setState({ input: e.target.value });
  submitMessage = (e) => {
    e.preventDefault();
    const { input } = this.state;
    if (input) {
      this.setState({ input: '' });
      this.props.addMessage({ author: this.props.user, text: input });
    }
  }
  componentDidUpdate() {
    const chat = document.getElementById('messageContainer');
    chat.scrollTop = chat.scrollHeight;
  }
  render() {
    return (
      <div className="ui container segment" id="chat">
        <div>
          <div className="ui comments">
            <h2 className="ui dividing header">The Mess Hall is a place to connect with other members:</h2>
            <div id='messageContainer'>
              <ChatMessages
                edit={this.state.edit}
                setEdit={this.setEdit}
                saveEdit={this.saveEdit}
                finishEdit={this.finishEdit}
                deleteMessage={this.deleteMessage}
                editText={this.state.editText}
                like={this.props.likeMessage}
                user={this.props.user}
                chat={this.props.chat} />
            </div>
          </div>
        </div>
        <form className="ui form" onSubmit={this.submitMessage}>
          <input
            type="text"
            placeholder="Join the conversation here..."
            value={this.state.input}
            onChange={this.handleChange} />
          <button className="ui teal button" onClick={this.submitMessage}>Submit Message</button>
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
  deleteMessage,
  broadcastEdit
};

export default connect(mapStateToProps, dispatch)(ChatController);
