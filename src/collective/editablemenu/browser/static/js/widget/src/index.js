import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

export const app = () =>
  ReactDOM.render(<App />, document.getElementById('root'));

if (process && process.env.NODE_ENV === 'development') {
  app();
}
