import React from 'react';
import { connect } from 'react-redux';
import Modal from './ChatModal';
import EmojiInput from './EmojiInput';
import ChatMessages from './Chat';
import {
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
      scroll: false,
      modal: false
    };
    // this sucks when screen resized smaller... will need to deal with that:
    document.body.style.backgroundImage = "url('/images/fcc-banner.png')";
  }
  componentDidMount() {
    this.chatContainer = document.getElementById('messageContainer');
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  }
  componentDidUpdate() {
    if (this.state.scroll) {
      this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
      this.setState({ scroll: false });
    };
  }
  componentWillUnmount() {
    document.body.style.backgroundImage = null;
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
  deleteMessage = (id) => {
    this.setState({
      edit: null,
      editText: null
    });
    this.props.deleteMessage(id);
  }
  submitMessage = (text) => {
    this.setState({ text: '', scroll: true });
    this.props.addMessage({ author: this.props.user, text });
  }
  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  }
  render() {
    return (
      <div className="ui container segment" id="chat">
        <Modal size="large" open={this.state.modal} close={this.toggleModal} />
        <div>
          <div className="ui comments">
            <h2 className="ui dividing header">The Mess Hall is a place to connect with other members:</h2>
            <i onClick={this.toggleModal} className="info teal circle icon" id="infoIcon"></i>
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
        <EmojiInput
          submit={this.submitMessage}
          placeholder={
            (this.props.chat.size === 0 ?
              "Start" : "Join" ) + " the conversation here..."} />
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
