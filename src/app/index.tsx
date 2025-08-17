import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { AppRoutes } from '@app/routes';
import { LandingPage } from '@app/LandingPage/LandingPage';
import '@app/app.css';
import { AuthProvider, useAuth } from '@app/utils/AuthContext';

interface AppProps {
  mockAuthenticated?: boolean;
}

const AppContent: React.FunctionComponent = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  ) : (
    <LandingPage />
  );
};

const App: React.FunctionComponent<AppProps> = ({ mockAuthenticated }) => (
  <AuthProvider mockAuthenticated={mockAuthenticated}>
    <Router>
      <AppContent />
    </Router>
  </AuthProvider>
);

export default App;
