import React from 'react';
import styled from 'styled-components';

const MyFrame = styled.iframe`
  width: 100vw;
  height: 90vh;
  margin: 0;
  padding: 0;
  margin-top: -20px;
`;

const GitterGlobal = ({ match: { params: { username } }}) => {
  if (username) return <MyFrame src={`https://gitter.im/${username}/~embed`} />
  return <MyFrame src="https://gitter.im/gitterHQ/gitter/~embed" />
}

export default GitterGlobal;
