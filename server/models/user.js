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

// const User = new Schema({
//   verifiedUser: Boolean,
//   memberSince: { type: Date, default: Date.now },
//   avatarUrl: String,
//   githubId: String,
//   personal: {
//     username: String,
//     profileUrl: String,
//     displayName: String,
//     email: String,
//     location: String,
//     bio: String
//   },
//   fccCerts: {
//     Front_End: Boolean,
//     Back_End: Boolean,
//     Data_Visulization: Boolean
//   },
//   mentorship: {
//     isMentor: Boolean,
//     mentorshipSkills: String
//   },
//   skillsAndInterests: {
//     coreSkills: Array,
//     codingInterests: Array
//   },
//   projects: Array,
//   social: {
//     codepen: String,
//     linkedin: String,
//     twitter: String,
//   },
//   career: {
//     working: String,
//     company: String,
//     tenure: String,
//     jobSearch: String,
//   }
// });

export default mongoose.model('User', User);