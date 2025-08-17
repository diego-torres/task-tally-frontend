import * as React from 'react';
import { PageSection, Title } from '@patternfly/react-core';

const GitSSHKeys: React.FunctionComponent = () => (
  <PageSection>
    <Title headingLevel="h1" size="xl">
      Git SSH keys
    </Title>
    <p>Manage SSH keys used for Git operations.</p>
  </PageSection>
);

export { GitSSHKeys };
