import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

export const app = (portalUrl = '', translations = {}) => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;
  const component = <App {...{ portalUrl, translations }} />;

  const root = ReactDOM.createRoot(rootElement);
  root.render(component);
};

if (process && process.env.NODE_ENV === 'development') {
  app('http://localhost:8080/Plone', {});
}
