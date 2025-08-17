import * as React from 'react';
import { BackgroundImage, Bullseye, Button, Stack, StackItem, Title } from '@patternfly/react-core';
import { GoogleIcon } from '@patternfly/react-icons';
import pfbg from '@assets/images/PF-Backdrop.svg';

const backendUrl = process.env.TASK_TALLY_BACKEND || '/api';

const LandingPage: React.FunctionComponent = () => (
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
          <Button icon={<GoogleIcon />} variant="primary" size="lg" component="a" href={`${backendUrl}/auth/google`}>
            Sign in with Google
          </Button>
        </StackItem>
      </Stack>
    </Bullseye>
  </BackgroundImage>
);

export { LandingPage };
