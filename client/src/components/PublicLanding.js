import React from 'react';
import styled from 'styled-components';

class About extends React.Component {
  state = { flashMessageCleared: false }
  componentDidMount = () => document.addEventListener('click', this.handleClick);
  componentWillUnmount = () => document.removeEventListener('click', this.handleClick);
  // 'close' is className of close icon in flash message
  handleClick = (e) => e.target.classList.contains('close')
    ? this.setState({ flashMessageCleared: true })
    : this.setState({ flashMessageCleared: false });
  render() {
    const { flashMessageCleared } = this.state;
    // handles margins when flash messages are rendered and
    // also when subsequently removed. handleClick and state of
    // this component are all related to this.
    const Container = styled.div`
      marginTop: ${ document.getElementsByClassName('flashMessage').length > 0 && !flashMessageCleared ? '50px' : '145px'} !important;
      fontSize: 18px !important;
    `;
    return (
      <Container className="ui raised very piled padded text container segment">
        <h1 className="ui header">Welcome to the freeCodeCamp Alumni Network</h1>
        <p>
          <strong>freeCodeCamp</strong> has an incredible and vibrant international community. We
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
          students who have completed at least one FCC Certificate. (<strong>Note:</strong> You will
          have to make your FCC profile public for this validation to work.)
        </p>
        <p>
          Our goal is to create a focused community of like-minded individuals who can
          benefit from each others culminated experience and expertise, whether in new
          technologies, programming skills, or career advice.
        </p>
        <h2>Thanks for visiting, and happy coding!</h2>
      </Container>
    );
  }
}

export default About;
