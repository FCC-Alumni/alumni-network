import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const User = new Schema({
    githubId: String,
    username: String,
    avatarUrl: String,
    githubUrl: String
});

export default mongoose.model('User', User);