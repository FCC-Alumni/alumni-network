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
      editText: null,
      scroll: false
    };
  }
  setEdit = (id) => {
    if (this.state.editText !== '') {
      if (this.state.edit) this.props.broadcastEdit(this.state.edit);
      this.setState({
        edit: id,
        editText: this.props.chat.find(m => m.get('id') === id).get('text')
      });
    };
  }
  deleteMessage = (id) => {
    this.setState({
      edit: null,
      editText: null
    });
    this.props.deleteMessage(id);
  }
  saveEdit = (e) => {
    const editText = e.target.value;
    this.setState({ editText });
    if (editText) this.props.saveEdit(this.state.edit, this.state.editText);
  }
  finishEdit = (e) => {
    e.preventDefault();
    if (this.state.editText) {
      this.props.broadcastEdit(this.state.edit);
      this.setState({
        edit: null,
        editText: null
      });
    };
  }
  handleChange = (e) => this.setState({ input: e.target.value });
  submitMessage = (e) => {
    e.preventDefault();
    const { input } = this.state;
    if (input) {
      this.setState({ input: '', scroll: true });
      this.props.addMessage({ author: this.props.user, text: input });
    };
  }
  componentDidUpdate() {
    if (this.state.scroll) {
      const chat = document.getElementById('messageContainer');
      chat.scrollTop = chat.scrollHeight;
      this.setState({ scroll: false });
    };
  }
  render() {
    return (
      <div className="ui container segment" id="chat">
        <div>
          <div className="ui comments">
            <h2 className="ui dividing header">The Mess Hall is a place to connect with other members:</h2>
            <div id='messageContainer'>
              <ChatMessages
                user={this.props.user}
                chat={this.props.chat}
                edit={this.state.edit}
                setEdit={this.setEdit}
                saveEdit={this.saveEdit}
                finishEdit={this.finishEdit}
                editText={this.state.editText}
                like={this.props.likeMessage}
                deleteMessage={this.deleteMessage} />
            </div>
          </div>
        </div>
        <form className="ui form" onSubmit={this.submitMessage}>
          <input
            autoFocus
            type="text"
            placeholder={(this.props.chat.size === 0 ? "Start" : "Join" ) + " the conversation here..."}
            value={this.state.input}
            onChange={this.handleChange} />
          <button className="ui teal button" onClick={this.submitMessage}>Submit Message</button>
        </form>
      </div>
    );
  }
};

ChatController.propTypes = {
  user: React.PropTypes.object.isRequired,
  chat: React.PropTypes.object.isRequired,
  addMessage: React.PropTypes.func.isRequired,
  saveEdit: React.PropTypes.func.isRequired,
  likeMessage: React.PropTypes.func.isRequired,
  deleteMessage: React.PropTypes.func.isRequired,
  broadcastEdit: React.PropTypes.func.isRequired
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
