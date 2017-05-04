/* eslint-disable */
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, NavLink } from 'react-router-dom';
import { connectScreenSize } from 'react-screen-size';
import { mapScreenSizeToProps } from '../../Navbar';
import EmojiInput from './EmojiInput';
import { List, Set, Map } from 'immutable';
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

    const { conversant, privateChat, totalNotifications, onlineStatus, screen } = this.props;

    const privateChannels = (
      <div id="privateChatChannels">
        <h3 className='privateChannelsTitle'>Private Chat Channels:</h3>
      { privateChat.size > 0
        ? privateChat.keySeq().map(username => {
            if (username === conversant) return;
            const notifications = privateChat.getIn([username, 'notifications']);
            const style = notifications > 0 ? { marginLeft: -8 } : { marginLeft: 8 };
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
          })
        : <span>
            <strong>No Private Chats yet!</strong><br/>
            <p className='noChannelsMessage'>Click another user's name to start a chat with them.</p>
          </span> }
          <i className="remove icon" id="closePrivateChat" onClick={this.togglePrivateChannels} />
      </div>
    );

    return (
      <div className="ui container segment" id="chat">
        <Modal size="large" open={this.state.modal} close={this.toggleModal} />
        <div>
          <div className="ui comments">
            <h2 className="ui dividing header" style={ !screen.isDesktop ? { width: 200 } : null }>
          { conversant
            ? <span style={ !screen.isDesktop ? { fontSize: 16 } : null }>
                <img src={this.props.conversantAvatar} className='privateAvatar' alt={`${conversant}'s Avatar'`} />
                Private Chat with&nbsp;
                <span
                  className='conversant'
                  onClick={() => this.props.history.replace(`/dashboard/profile/${conversant}`)}>
                  {conversant}
                </span>
              { !onlineStatus.has(conversant) &&
                <span style={{ fontSize: 16, marginLeft: 5 }}>(offline)</span> }
              </span>
            : <span style={ !screen.isDesktop ? { fontSize: 16 } : null }>
                Welcome to the Alumni Mess Hall:
              </span> }
            </h2>
        { totalNotifications
          ? <div onClick={this.togglePrivateChannels} id="privateChatIconWrapper">
              <i className="comments green icon" id="privateChatIcon" />
              <span className="notifications totalNotifications">{totalNotifications}</span>
            </div>
          : <div onClick={this.togglePrivateChannels}>
              <i className="comments green icon" id="privateChatIcon" />
            </div> }
        { conversant
          ? <NavLink to='/dashboard/chat'>
              <i className="green home icon" id="infoIcon" />
            </NavLink>
          : <i onClick={this.toggleModal} className="info green circle icon" id="infoIcon" /> }

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
  user: propTypes.object.isRequired,
  chat: propTypes.object.isRequired,
  saveEdit: propTypes.func.isRequired,
  mentors: propTypes.object.isRequired,
  addMessage: propTypes.func.isRequired,
  likeMessage: propTypes.func.isRequired,
  deleteMessage: propTypes.func.isRequired,
  broadcastEdit: propTypes.func.isRequired,
  onlineStatus: propTypes.object.isRequired,
  clearNotifications: propTypes.func.isRequired,
};

export const findMentors = (community) => {
  return Set(community.map(user => {
    if (user.mentorship.isMentor) return user.username;
  }));
};

const findUser = (community, username) =>
  community.filter(u => u.username.toLowerCase() === username.toLowerCase() && u)[0];

const mapStateToProps = ({ user, chat, privateChat, community, onlineStatus }, props) => {
  // handle manually typed chat routes, allow case insensitivity.
  // if user types route for own username, set to null
  // to render main chat component.
  const USR_PARAM = props.match.params.username ? props.match.params.username : '';
  let username = findUser(community.toJS(), USR_PARAM);
  if (username && username.username !== user.username) {
    username = username.username;
  } else {
    username = null;
  }
  /* This is all to account for this component mounting before the parent AppContainer
  has finished fetching chat history from the server... (i.e. user refreshes on a
  private chat route. This isn't ideal but the alternative is implement a lot of
  loading state and conditional rendering in the components for all of the
  dispatches for chat, community, private chat, etc.) For now this will do: ******/
  if (username) {
    let chat = List();
    let conversantAvatar = '';
    let totalNotifications = 0;
    let mentors = Set();
    try {
      chat = privateChat.getIn([username, 'history']);
    } catch(e) {
      console.warn('Chat Controller waiting on props...');
    }
    try {
      conversantAvatar = community.find(u => u.username === username).personal.avatarUrl;
    } catch (e) {
      if (community.size) {
        console.log('Community exists but there is no such user, redirect:')
        props.history.push('/dashboard/chat');
      } else {
        console.warn('Chat Controller waiting on props...');
      }
    }
    try {
      totalNotifications = privateChat.reduce((t,c) => t + c.get('notifications'), 0);
    } catch (e) {
      console.warn('Chat Controller waiting on props...');
    }
    try {
      mentors = findMentors(community);
    } catch(e) {
      console.warn('Chat Controller waiting on props...');
    }
    return {
      user,
      mentors,
      onlineStatus,
      conversantAvatar,
      totalNotifications,
      conversant: username,
      community: community,
      privateChat: privateChat,
      chat: chat ? chat : List()
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
