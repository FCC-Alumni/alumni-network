import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Bring whitelist from javascript object to mongodb
const WhiteListedUser = new Schema ({
    githubUsername: { type: String, default: '' },
    fccUsername: { type: String, default: '' },
});

export default mongoose.model('WhiteListedUser', WhiteListedUser);