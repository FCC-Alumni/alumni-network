import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Chat = new Schema({
  history: [{
    id: String,
    timestamp: Number,
    text: String,
    author: String,
    avatar: String,
    likes: Array,
    edited: Boolean,
  }]
});

export default mongoose.model('Chat', Chat);
