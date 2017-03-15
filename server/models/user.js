import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const User = new Schema({
    githubId: String,
    username: String,
    avatarUrl: String,
    githubData: Object,
    fccCerts: Object,
    email: { type: String, lowercase: true },
    verifiedUser: Boolean,
    memberSince: { type: Date, default: Date.now },

    //This comes from the State in Dashboard.js
    projects: Array,
    interests: Array,
    skills: Array,
    mentor: Boolean
});

export default mongoose.model('User', User);