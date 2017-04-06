/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import { Route, NavLink } from 'react-router-dom';
import { connectScreenSize } from 'react-screen-size';
import { mapScreenSizeToProps } from '../../Navbar';
import EmojiInput from './EmojiInput';
import { List, Set } from 'immutable';
import ChatMessages from './Chat';
import Modal from './ChatModal';
import axios from 'axios';
import {
  addMessage,
  saveEdit,
  likeMessage,
  deleteMessage,
  broadcastEdit,
  fetchPrivateChat,
  clearNotifications,
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
      privateChannels: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.screen.isDesktop) {
      document.body.style.backgroundImage = "url('/images/fcc-banner.png')";
    } else {
      document.body.style.backgroundImage = null;
    }
  }
  componentDidMount() {
    this.chatContainer = document.getElementById('messageContainer');
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    document.addEventListener('keydown', this.handleKeyPress);
    if (this.props.screen.isDesktop) {
      document.body.style.backgroundImage = "url('/images/fcc-banner.png')";
    }
    if (this.props.conversant) {
      this.setState({ privateChannels: false });
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.chat.size > prevProps.chat.size) {
      this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
  }
  componentWillUnmount() {
    document.body.style.backgroundImage = null;
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }
  handleKeyPress = (e) => {
    // escape key closes private chat channels menu if open:
    if (e.keyCode === 27 && this.state.privateChannels) {
      this.setState({ privateChannels: false });
    }
  }
  submitMessage = (text) => {
    const { conversant } = this.props;
    this.setState({ text: '' });
    this.props.addMessage({ author: this.props.user, text, conversant });
  }
  setEdit = (id) => {
    if (this.state.editText !== '') {
      const { edit, editText } = this.state;
      const { user, conversant, chat } = this.props;
      if (this.state.edit) this.props.broadcastEdit(edit, editText, conversant, user.username);
      this.setState({
        edit: id,
        editText: this.props.chat.find(m => m.get('id') === id).get('text')
      }, () => {
        if (chat.last().get('id') === id) {
          this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        }
      });
    };
  }
  saveEdit = (e) => this.setState({ editText: e.target.value });
  finishEdit = (e) => {
    e.preventDefault();
    const { edit, editText } = this.state;
    if (editText) {
      // only save edit if there is a change, otherwise this 'cancels'
      if (this.props.chat.find(m => m.get('id') === edit).get('text') !== editText) {
        const { user, conversant } = this.props;
        this.props.broadcastEdit(edit, editText, conversant, user.username);
      }
      this.setState({ edit: null, editText: null });
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
  initiatePrivateChat = (recipient, notifcations) => {
    if (!this.props.privateChat.has(recipient)) {
      this.props.initiatePrivateChat(recipient);
    } else if (notifcations) {
      this.props.clearNotifications({
        author: this.props.user.username,
        recipient
      });
    }
    if (this.props.match.params.username) {
      this.props.history.push(recipient);
    } else {
      this.props.history.push(`chat/${recipient}`);
    }
  }
  render() {

    const { conversant, privateChat, totalNotifications, screen } = this.props;

    const privateChannels = (
      <div id="privateChatChannels">
        <h3 className='privateChannelsTitle'>Private Chat Channels:</h3>
        {privateChat.size > 0 ? privateChat.keySeq().map(username => {
          if (username === conversant) return;
          const notifications = privateChat.getIn([username, 'notifications']);
          const style = notifications > 0 ? { marginLeft: '-8px' } : { marginLeft: '8px' };
          return (
            <div
              key={username}
              className='privateChannel'
              onClick={this.initiatePrivateChat.bind(this, username, notifications)}>
              <img src={this.props.community.find(u => u.username === username).personal.avatarUrl} alt="User Avatar"/>
              {notifications > 0 &&
                <span className="notifications privateNotifications">{notifications}</span>}
              <span className="privateUsername" style={style}>{username.slice(0, 25)}</span>
            </div>
          );
        }) :
          <span>
            <b>No Private Chats yet!</b><br/>
            Click another user's name to start a chat with them.
          </span>}
          <i className="remove icon" id="closePrivateChat" onClick={this.togglePrivateChannels}></i>
      </div>
    );

    return (
      <div className="ui container segment" id="chat">
        <Modal size="large" open={this.state.modal} close={this.toggleModal} />
        <div>
          <div className="ui comments">
            <h2 className="ui dividing header">

            {conversant ?

              <span style={ !screen.isDesktop ? { fontSize: '16px' } : null }>
                <img src={this.props.conversantAvatar} className='privateAvatar' alt={`${conversant}'s Avatar'`} />
                Private Chat with <span className='conversant'> {conversant} </span>
              </span>

              :

              <span style={ !screen.isDesktop ? { fontSize: '16px' } : null }>
                Welcome to the Alumni Mess Hall:
              </span>

            }

            </h2>

            { totalNotifications ?

              <div onClick={this.togglePrivateChannels} id="privateChatIconWrapper">
                <i className="comments teal icon" id="privateChatIcon"></i>
                <span className="notifications totalNotifications">{totalNotifications}</span>
              </div>

              :

              <div onClick={this.togglePrivateChannels}>
                <i className="comments teal icon" id="privateChatIcon"></i>
              </div> }

            {conversant ?
              <NavLink to='/dashboard/chat'>
                <i className="teal home icon" id="infoIcon"></i>
              </NavLink> :
              <i onClick={this.toggleModal} className="info teal circle icon" id="infoIcon"></i>}

            {this.state.privateChannels && privateChannels}

            <div id='messageContainer'>
              <ChatMessages
                history={this.props.history}
                user={this.props.user}
                chat={this.props.chat}
                edit={this.state.edit}
                setEdit={this.setEdit}
                saveEdit={this.saveEdit}
                finishEdit={this.finishEdit}
                mentors={this.props.mentors}
                like={this.props.likeMessage}
                editText={this.state.editText}
                recipient={this.props.conversant}
                deleteMessage={this.deleteMessage}
                onlineStatus={this.props.onlineStatus}
                initiatePrivateChat={this.initiatePrivateChat}
                conversantAvatar={this.props.conversantAvatar}
                path={conversant ? null : this.props.match.url} />
            </div>
          </div>
        </div>
        <EmojiInput
          screen={screen}
          submit={this.submitMessage}
          placeholder={(this.props.chat.size === 0 ?
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
  clearNotifications: React.PropTypes.func.isRequired,
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
      conversant: username,
      community: community,
      privateChat: privateChat,
      mentors: findMentors(community),
      chat: privateChat.getIn([username, 'history']),
      totalNotifications: privateChat.reduce((t,c) => t + c.get('notifications'), 0),
      conversantAvatar: community.find(u => u.username === username).personal.avatarUrl
    }
  } else {
    return {
      user,
      chat,
      onlineStatus,
      conversant: null,
      community: community,
      conversantAvatar: null,
      mentors: findMentors(community),
      privateChat: privateChat,
      totalNotifications: privateChat.reduce((t,c) => t + c.get('notifications'), 0),
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
  clearNotifications,
  initiatePrivateChat
};

export default connectScreenSize(mapScreenSizeToProps)(
  connect(mapStateToProps, dispatch)(ChatController));
