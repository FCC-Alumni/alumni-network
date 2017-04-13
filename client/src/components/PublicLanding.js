import React from 'react';

const style = {
  marginTop: '125px',
  fontSize: '18px',
};

export default () => (
  <div className="ui raised very piled padded text container segment" style={style}>
    <h1 className="ui header">Welcome to the freeCodeCamp Alumni Network</h1>
    <p>
      <b>freeCodeCamp</b> has an incredible and vibrant international community. We
      built this app specifically to try and cultivate relationships among experienced campers.
    </p>
    <p>
      Currently, the FCC Forum, Gitter, and other resources provide ample opportunities
      for campers at any skill level. We wanted to create an environment specifically
      for more experienced campers who are looking for advanced collaborative
      projects or mentorship opportunities, as a mentor or mentee.
    </p>
    <p>
      Our authentication process verifies the FCC progress of users, and only admits
      students who have completed at least one FCC Certificate. (<b>Note:</b> you will
      have to make your FCC profile public for this validation to work.)
    </p>
    <p>
      Our goal is to create a focused community of like-minded individuals who can
      benefit from each others culminated experience and expertise, whether in new
      technologies, programming skills, or career advice.
    </p>
    <h2>Thanks for visiting, and happy coding!</h2>
  </div>
);
