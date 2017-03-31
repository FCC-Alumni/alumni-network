/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import { Route, NavLink } from 'react-router-dom';
import axios from 'axios';
import { List, Set } from 'immutable';
import Modal from './ChatModal';
import EmojiInput from './EmojiInput';
import ChatMessages from './Chat';
import {
  addMessage,
  saveEdit,
  likeMessage,
  deleteMessage,
  broadcastEdit,
  fetchPrivateChat,
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
      modal: false,
      privateChannels: false,
      scroll: true
    };
    // this sucks when screen resized smaller... will need to deal with that:
    document.body.style.backgroundImage = "url('/images/fcc-banner.png')";
    // scroll to bottom of chats when component mounts:
    this.timeout(() => {
      if (this.chatContainer) {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
      }
    }, 50);

  }
  componentDidMount() {
    document.body.style.backgroundImage = "url('/images/fcc-banner.png')";
    this.chatContainer = document.getElementById('messageContainer');
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;

    document.addEventListener('mousedown', this.handleClick);

    // if there are no private chat messages try to fetch from server:
    // this isn't ideal but we are not storing any 'Fetched Yet?' state anywhere
    if (this.props.privateChatSize === 0) {
      this.props.fetchPrivateChat(this.props.user.username);
    }
  }
  componentWillUnmount() {
    document.body.style.backgroundImage = null;
    document.removeEventListener('mousedown', this.handleClick, false);
    clearTimeout(this.timeout);
  }
  // safeguard timeouts within a method so we can clear when component unmounts:
  timeout = (fn, d) => setTimeout(() => fn(), d);
  submitMessage = (text) => {
    const { conversant } = this.props;
    this.setState({ text: '' });
    this.props.addMessage({ author: this.props.user, text, conversant });
    this.timeout(() => this.chatContainer.scrollTop = this.chatContainer.scrollHeight, 50);
  }
  setEdit = (id) => {
    if (this.state.editText !== '') {
      const { edit, editText } = this.state;
      const { user, conversant } = this.props;
      if (this.state.edit) this.props.broadcastEdit(edit, editText, conversant, user.username);
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
      const { edit, editText } = this.state;
      const { user, conversant } = this.props;
      this.props.broadcastEdit(edit, editText, conversant, user.username);
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
    this.props.deleteMessage(id, this.props.conversant, this.props.user.username);
  }
  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  }
  togglePrivateChannels = () => {
    this.setState({
      privateChannels: !this.state.privateChannels
    });
  }
  initiatePrivateChat = (author) => {
    this.props.initiatePrivateChat(author);
    this.setState({ scroll: false });
    this.props.history.push(`chat/${author}`);
  }
  handleClick = (e) => {
    if (e.srcElement.id !== 'privateChatChannels' &&
        e.srcElement.className !== 'privateChannel' &&
        e.srcElement.className !== 'privateChannelsTitle') {
      this.setState({
        privateChannels: false
      });
    }
  }
  render() {

    const { conversant, privateChat } = this.props;

    const privateChannels = (
      <div id="privateChatChannels">
        <h3 className='privateChannelsTitle'>Private Chat Channels:</h3>
        {privateChat.size > 0 ? privateChat.map(username => {
          return (
            <div
              key={username}
              className='privateChannel'
              onClick={this.initiatePrivateChat.bind(this, username)}>
              {username}
            </div>
          );
        }) :
          <span>
            <b>No Private Chats yet!</b><br/>
            Click another user's name to start a chat with them.
          </span>}
      </div>
    );

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
            {!conversant && <div>
              <i onClick={this.togglePrivateChannels} className="comments teal icon" id="privateChatIcon"></i>
              <i onClick={this.toggleModal} className="info teal circle icon" id="infoIcon"></i>
            </div>}
            {this.state.privateChannels && privateChannels}
            <div id='messageContainer'>
              <ChatMessages
                user={this.props.user}
                chat={this.props.chat}
                edit={this.state.edit}
                setEdit={this.setEdit}
                saveEdit={this.saveEdit}
                finishEdit={this.finishEdit}
                mentors={this.props.mentors}
                like={this.props.likeMessage}
                editText={this.state.editText}
                reciepient={this.props.conversant}
                deleteMessage={this.deleteMessage}
                onlineStatus={this.props.onlineStatus}
                initiatePrivateChat={this.initiatePrivateChat}
                conversantAvatar={this.props.conversantAvatar}
                path={conversant ? null : this.props.match.url} />
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
  broadcastEdit: React.PropTypes.func.isRequired,
  mentors: React.PropTypes.object.isRequired,
  onlineStatus: React.PropTypes.object.isRequired
};

export const findMentors = (community) => {
  return Set(community.map(user => {
    if (user.mentorship.isMentor) return user.username;
  }));
};

const mapStateToProps = ({ user, chat, privateChat, community, onlineStatus }, props) => {
  const { username } = props.match.params;
  if (username) {
    return {
      user,
      onlineStatus,
      privateChat: [],
      conversant: username,
      mentors: findMentors(community),
      chat: privateChat.get(username),
      conversantAvatar: community.find(u => u.username === username).personal.avatarUrl
    }
  } else {
    return {
      user,
      chat,
      onlineStatus,
      conversant: null,
      conversantAvatar: null,
      mentors: findMentors(community),
      privateChat: privateChat.keySeq(),
      privateChatSize: privateChat.size
    }
  }
};

const dispatch = {
  saveEdit,
  addMessage,
  likeMessage,
  deleteMessage,
  broadcastEdit,
  fetchPrivateChat,
  initiatePrivateChat
};

export default connect(mapStateToProps, dispatch)(ChatController);
