import * as React from 'react';
import { Bullseye, Button, Stack, StackItem, Title } from '@patternfly/react-core';
import { useAuth } from '@app/utils/AuthContext';

const LandingPage: React.FunctionComponent = () => {
  const { login } = useAuth();
  return (
    <div
      className="pf-c-background-image"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        color: '#fff',
        textAlign: 'center',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Bullseye>
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h1" size="4xl">
              Task Tally
            </Title>
          </StackItem>
          <StackItem>
            <Title headingLevel="h2" size="lg">
              Consulting Templates & Task Management
            </Title>
          </StackItem>
          <StackItem>
            <Button variant="primary" size="lg" onClick={login}>
              Sign in
            </Button>
          </StackItem>
        </Stack>
      </Bullseye>
    </div>
  );
};

import '../../app/app.css';
import './landing-dark.css';
import background from '../../background.png';
export { LandingPage };
