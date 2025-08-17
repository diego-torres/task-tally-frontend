import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { AppRoutes } from '@app/routes';
import { LandingPage } from '@app/LandingPage/LandingPage';
import '@app/app.css';

interface AppProps {
  mockAuthenticated?: boolean;
}

const App: React.FunctionComponent<AppProps> = ({ mockAuthenticated }) => {
  const isAuthenticated = mockAuthenticated ?? false;
  return (
    <Router>
      {isAuthenticated ? (
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
