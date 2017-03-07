import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const User = new Schema({
    githubId: String,
    ghUsername: String,
    fccUsername: String,
    avatarUrl: String,
    githubData: Object,
    fccCerts: Object,
    verifiedUser: Boolean
});

export default mongoose.model('User', User);