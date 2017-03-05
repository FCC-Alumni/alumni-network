import React from 'react';
import axios from 'axios';

class PassportPage extends React.Component {
  componentDidMount() {
    axios.get('/api/user').then(res => {
      console.log(res);
      console.log(res.data);
    });
  }
  render() {
    return (
      <div>
        <h1>Welcome!</h1>
      </div>
    );
  }
}

export default PassportPage;