import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const HonoraryMember = new Schema ({
    username: { type: String, default: '' },
    reason: { type: String, default: '' }
});

export default mongoose.model('HonoraryMember', HonoraryMember);
