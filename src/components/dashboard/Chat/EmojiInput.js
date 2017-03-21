import React from 'react';
import EmojiPicker from 'react-emoji-picker';
import emojiMap from 'react-emoji-picker/lib/emojiMap';

export default class Emoji extends React.Component {

  state = {
    text: '',
    last: '',
    emoji: null,
    showEmojiPicker: false
  }

  validateEmoji = () => {
    const matched = emojiMap.filter(emoji => `:${emoji.name}:` === this.state.last);
    if (!matched) this.setState({ emoji: null })
  }

  toggleEmojiPicker = () => {
    if (this.state.showEmojiPicker) {
      this.setState({ showEmojiPicker: false });
    } else {
      this.setState({ showEmojiPicker: true });
    }
  }

  updateState = (e) => {
    const text = e.target.value;
    const last = text.split(' ').pop();
    const show = (last.charAt(0) === ':') ? true : false;
    this.setState({
      last,
      text,
      emoji: last,
      showEmojiPicker: show
    });
  }

  setEmoji = (emoji) => {
    let { text } = this.state;
    if (text !== '') {
      let split = text.split(' ');
      split.pop();
      split.push(emoji + ' ');
      let joined = split.join(' ');
      this.setState({
        text: joined,
        showEmojiPicker: false
      });
    } else {
      this.setState({
        text: emoji + ' ',
        showEmojiPicker: false
      });
    }
    this.chatInput.focus();
  }

  submit = (e) => {
    e.preventDefault();
    const { text } = this.state;
    if (text) {
      this.setState({
        text: '',
        last: '',
        emoji: null,
        showEmojiPicker: false
      });
      this.props.submit(text);
    }
  }

  render() {
    const emojiPickerStyles = {
      zIndex: '2'
      width: '100%',
      position: 'absolute',
      left: 0, top: '40px',
      padding: '.3em .6em',
      border: '1px solid #0074d9',
      backgroundColor: 'rgba(250,250,250,0.98)',
    };
    return (
      <form className="ui form" onSubmit={this.submit}>
        <input
          autoFocus
          name="emoji"
          id='chatInput'
          autoComplete="off"
          value={this.state.text}
          onChange={this.updateState}
          placeholder={this.props.placeholder}
          ref={(input) => { this.chatInput = input }}
          type={this.state.showEmojiPicker ? "search" : "text"} />
        <i
          id="smiles"
          className="smile icon"
          onClick={this.toggleEmojiPicker}>
        </i>
        {this.state.showEmojiPicker &&
          <EmojiPicker
            query={this.state.emoji}
            onSelect={this.setEmoji}
            style={emojiPickerStyles} />}
        <button className="ui teal button" onClick={this.submit}>Submit Message</button>
      </form>
    );
  }
};

Emoji.propTypes = {
  submit: React.PropTypes.func.isRequired,
  placeholder: React.PropTypes.string.isRequired
}
