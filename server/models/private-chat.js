import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PrivateChat = new Schema({
  members: Array,
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

export default mongoose.model('PrivateChat', PrivateChat);
