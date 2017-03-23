import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { List } from 'immutable';
import Modal from './ChatModal';
import EmojiInput from './EmojiInput';
import ChatMessages from './Chat';
import {
  addMessage,
  deleteMessage,
  saveEdit,
  likeMessage,
  broadcastEdit,
  initiatePrivateChat
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
    document.body.style.backgroundImage = "url('/images/fcc-banner.png')";
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
    if (editText) {
      this.props.saveEdit(this.state.edit, this.state.editText, this.props.conversant);
    }
  }
  finishEdit = (e) => {
    e.preventDefault();
    if (this.state.editText) {
      this.props.broadcastEdit(this.state.edit, this.props.conversant);
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
    this.props.deleteMessage(id, this.props.conversant);
  }
  submitMessage = (text) => {
    const { conversant } = this.props;
    this.setState({ text: '', scroll: true });
    this.props.addMessage({ author: this.props.user, text, conversant });
  }
  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  initiatePrivateChat = (author) => {
    this.props.initiatePrivateChat(author);
    this.props.history.push(`chat/${author}`);
  }

  render() {
    const { conversant } = this.props;
    return (
      <div className="ui container segment" id="chat">
        <Modal size="large" open={this.state.modal} close={this.toggleModal} />
        <div>
          <div className="ui comments">
            <h2 className="ui dividing header">

            {conversant ?

              <span>
                <img src={this.props.conversantAvatar} className='privateAvatar' alt={`${conversant}'s Avatar'`} />
                Private Chat with <span className='conversant'> {conversant} </span>
                <NavLink to='/dashboard/chat' className='linkHome'>
                  <i className="fa fa-arrow-left" aria-hidden="true"></i> <span>Back to Mess Hall</span></NavLink>
              </span>

              :

              'The Mess Hall is a place to connect with other members'

            }

            </h2>
            {!conversant && <i onClick={this.toggleModal} className="info teal circle icon" id="infoIcon"></i>}
            <div id='messageContainer'>
              <ChatMessages
                path={conversant ? null : this.props.match.url}
                user={this.props.user}
                chat={this.props.chat}
                edit={this.state.edit}
                setEdit={this.setEdit}
                saveEdit={this.saveEdit}
                finishEdit={this.finishEdit}
                editText={this.state.editText}
                like={this.props.likeMessage}
                reciepient={this.props.conversant}
                initiatePrivateChat={this.initiatePrivateChat}
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

const mapStateToProps = ({ user, chat, privateChat, community }, props) => {
  const { username } = props.match.params;
  if (username) {
    return {
      conversant: username,
      conversantAvatar: community.find(u => u.username === username).personal.avatarUrl,
      user,
      chat: privateChat.get(username)
    }
  } else {
    return {
      conversant: null,
      user,
      chat
    }
  }
};

const dispatch = {
  addMessage,
  saveEdit,
  likeMessage,
  deleteMessage,
  broadcastEdit,
  initiatePrivateChat
};

export default connect(mapStateToProps, dispatch)(ChatController);
