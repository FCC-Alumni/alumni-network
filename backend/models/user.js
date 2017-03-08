import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const User = new Schema({
    githubId: String,
    username: String,
    avatarUrl: String,
    githubData: Object,
    fccCerts: Object,
    email: { type: String, lowercase: true },
    verifiedUser: Boolean
});

export default mongoose.model('User', User);