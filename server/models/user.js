import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Any change to the schema must be reflected in passportLogin && mockData
const User = new Schema({
  githubId: { type: String, default: '' },
  username: { type: String, default: '' },
  verifiedUser: { type: Boolean, default: false },
  personal: {
    memberSince: { type: Date, default: Date.now },
    avatarUrl: { type: String, default: '' },
    profileUrl: { type: String, default: '' },
    displayName: { type: String, default: '' },
    email: {
      private: { type: Boolean, default: true },
      email: { type: String, default: '' }
    },
    location: { type: String, default: '' },
    bio: { type: String, default: '' },
    country: { type: String, default: '' },
    flag: { type: String, default: '' }
  },
  fccCerts: Object,
  mentorship: {
    isMentor: { type: Boolean, default: false },
    isMentee: { type: Boolean, default: false },
    mentorshipSkills: { type: String, default: '' },
  },
  skillsAndInterests: {
    coreSkills: Array,
    codingInterests: Array
  },
  projects: Array,
  social: {
    codepen: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
  },
  career: {
    working: { type: String, default: '' },
    company: { type: String, default: '' },
    tenure: { type: String, default: '' },
    jobSearch: { type: String, default: '' },
    hasBeenEmployed: { type: String, default: '' }
  }
});

export default mongoose.model('User', User);
