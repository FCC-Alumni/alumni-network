import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

/*******************************

  Should we write some tests...?

            Who writes tests...?

                      ¯\_(ツ)_/¯

*******************************/

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
