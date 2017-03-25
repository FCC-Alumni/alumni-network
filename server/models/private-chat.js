import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PrivateChat = new Schema({
  members: Array,
  history: Array
});

export default mongoose.model('PrivateChat', PrivateChat);
