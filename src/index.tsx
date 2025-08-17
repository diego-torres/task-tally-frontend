import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@app/index';
import { verifyGisInit } from '@app/utils/instrumentation';

if (process.env.NODE_ENV !== 'production') {
  const config = {
    rules: [
      {
        id: 'color-contrast',
        enabled: false,
      },
    ],
  };
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const axe = require('react-axe');
  axe(React, ReactDOM, 1000, config);
}
verifyGisInit(process.env.GOOGLE_CLIENT_ID || '');

const root = ReactDOM.createRoot(document.getElementById('root') as Element);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
