import Validator from 'validator';

export default {
  validate25Chars: (str) => {
    return Validator.isLength(str, { min: 0, max: 25 });
  },
  validateBio: (str) => {
    return Validator.isLength(str, { min: 0, max: 300 })
  },
  validateCareer: ({ working, tenure, company, jobSearch }) => {
    if (working && working === 'yes' && (!tenure || !company)) {
      return false;
    }
    if (working && working === 'no' && (!tenure || !jobSearch)) {
      return false;
    }
    return true;
  },
  validateCodePen: (str) => {
    return !Validator.isURL(str);
  },
  validateCountry: (str) => {
    if (!str) {
      return false;
    }
    return true;
  },
  validateDisplayName: (str) => {
    return Validator.isLength(str, { min: 0, max: 40 });
  },
  validateEmail: (str) => {
    if (str && !Validator.isEmail(str)) {
      return false;
    }
    return true;
  },
  validateMentorshipBio: (str) => {
    return Validator.isLength(str, { min: 0, max: 200 })
  },
  validateMentorshipSection: ({ isMentor, isMentee, mentorshipSkills }) => {
    if ((isMentee || isMentor) && !mentorshipSkills) {
      return false;
    }
    return true;
  },
}
