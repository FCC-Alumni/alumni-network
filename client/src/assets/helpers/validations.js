import Validator from 'validator';

export default {
  __25Chars: (str) => {
    return Validator.isLength(str, { max: 25 });
  },
  bio: (str) => {
    return Validator.isLength(str, { max: 300 })
  },
  career: ({ working, tenure, company, jobSearch, hasBeenEmployed }) => {
    if (working && working === 'yes' && (!tenure || !company)) {
      return false;
    }
    if (working && working === 'no' && (!tenure || !jobSearch || !hasBeenEmployed || (hasBeenEmployed === 'yes' && !company))) {
      return false
    }
    return true;
  },
  checkCompanyLength: (str) => {
    return str.split(',').length <= 3
  },
  codePen: (str) => {
    return !Validator.isURL(str);
  },
  country: (str) => {
    if (!str) {
      return false;
    }
    return true;
  },
  displayName: (str) => {
    return Validator.isLength(str, { max: 40 });
  },
  email: (str) => {
    if (str && !Validator.isEmail(str)) {
      return false;
    }
    return true;
  },
  mentorshipBio: (str) => {
    return Validator.isLength(str, { max: 200 })
  },
  mentorshipSection: ({ isMentor, isMentee, mentorshipSkills }) => {
    if ((isMentee || isMentor) && !mentorshipSkills) {
      return false;
    }
    return true;
  },
}
