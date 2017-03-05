import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const User = new Schema({
		githubId: String,
		login: String
});

export default mongoose.model('User', User);