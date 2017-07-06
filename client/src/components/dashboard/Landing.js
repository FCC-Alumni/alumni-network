import React from 'react';

const link = (
  <a
    href="https://github.com/FCC-Alumni/alumni-network"
    rel="noopener noreferrer"
    target="_blank" >
    {'open-source on GitHub'}
  </a>
);

const image = (source, position) => (
  <img
    alt='FCC logo'
    className={`ui small image floated ${position}`}
    src={source} />
);

export default () => (
  <div className="ui main text container" style={{ marginBottom: '25px' }}>
    <h1 className="ui centered header">
      {'Welcome to the freeCodeCamp Alumni Network!'}
    </h1>
    <div className="ui segment" style={{ fontSize: 18, paddingBottom: 35 }}>
      {image('/images/fcc_hands_in_logo.svg', 'left')}
      <p>
        {`We built this app to foster networking and mentorship opportunities
        among freeCodeCamp alumni. When we looked at the FCC community we saw
        that there are many opportunities for members to connect with each
        other, but few that are focused on the professional side. Our community
        is intended to be very focused on campers who are looking to level-up
        their skills, work on professional level projects, or focus on
        career-related goals, such as interviewing.`}
      </p>
      {image('/images/fcc_portfolio_logo.svg', 'right')}
      <p>
<<<<<<< 0f5c92c7cb73056e3aedd0a775f3d72099ddb2e4
        {'You can add information about your goals and interests in our '}
        <strong>{'Profile'}</strong>{` section, view all the members of our
        community in the `}<strong>{'Community'}</strong>{` tab, search for
        mentors in the `}<strong>{'Mentorship'}</strong>{` area, and chat
        with other users in the `}<strong>{'Mess Hall'}</strong>{'.'}
=======
        You can add information about your goals and interests in our <strong>Profile</strong> section,
        view all the members of our community in the <strong>Community</strong> tab, search for mentors in
        the <strong>Mentorship</strong> area, and chat with other users in our Gitter <strong>Mess Hall</strong>.
>>>>>>> remove chat from codebase
      </p>
      <p>
        {`One of the key features of this community is the focus on mentorship.
        We encourage anyone interested in becoming a mentor to indicate this
        on their profile and describe the core competencies they feel
        comfortable coaching others in. Because members must have an FCC
        certification to join, we feel confident that everyone will have some
        skills they could help mentor others in.`}
      </p>
      {image('/images/fcc_learn_logo.svg', 'left')}
      <p>
        {`Like freeCodeCamp, this project is completely ${link}. We strongly
        encourage members to contribute to the repository if they find bugs or
        think of new features. The current app has a strong base but we
        think there is a lot of space for improvement!`}
      </p>
      {image('/images/fcc_high_five_logo.svg', 'right')}
      <p>
        {`Thanks for joining! We hope this becomes a useful extension to the
        freeCodeCamp experience for all who join. Our essential goal here is
        to foster meaningful connections among campers and continue to encourage
        the development of great software.`}
      </p>
    </div>
  </div>
);
