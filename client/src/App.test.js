import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

/*******************************

  Should we write some tests...?

            Who writes tests...?

                      ¯\_(ツ)_/¯

*******************************/

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
