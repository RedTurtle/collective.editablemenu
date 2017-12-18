import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

export const app = (portalUrl = '', translations = {}) =>
  ReactDOM.render(
    <App {...{ portalUrl, translations }} />,
    document.getElementById('root')
  );

if (process && process.env.NODE_ENV === 'development') {
  app('http://localhost:8080/Plone', {});
}
