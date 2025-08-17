import * as React from 'react';
import { BackgroundImage, Bullseye, Button, Stack, StackItem, Title } from '@patternfly/react-core';
import { GoogleIcon } from '@patternfly/react-icons';
import pfbg from '@assets/images/PF-Backdrop.svg';
import { useAuth } from '@app/utils/AuthContext';

const LandingPage: React.FunctionComponent = () => {
  const { login } = useAuth();
  return (
    <BackgroundImage src={pfbg}>
      <Bullseye style={{ minHeight: '100vh' }}>
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
            <Button icon={<GoogleIcon />} variant="primary" size="lg" onClick={login}>
              Sign in with Google
            </Button>
          </StackItem>
        </Stack>
      </Bullseye>
    </BackgroundImage>
  );
};

export { LandingPage };
