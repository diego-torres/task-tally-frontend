import * as React from 'react';
import { Flex, FlexItem, List, ListItem, PageSection, Title } from '@patternfly/react-core';
import logo from '../../logo.png';

const Dashboard: React.FunctionComponent = () => (
  <>
    <PageSection>
      <Flex alignItems={{ default: 'alignItemsCenter' }}>
        <FlexItem>
          <img src={logo} alt="Task Tally logo" style={{ maxWidth: '150px' }} />
        </FlexItem>
        <FlexItem>
          <Title headingLevel="h1" size="4xl">
            Task Tally
          </Title>
          <p>
            An estimation tool based on &quot;The art of project estimation&quot; book. This tool allows users to create
            consulting estimates.
          </p>
        </FlexItem>
      </Flex>
    </PageSection>
    <PageSection>
      <div>
        <Title headingLevel="h2" size="xl">
          Ever wanted to propose a Container Adoption Journey, but just a little different?
        </Title>
        <p>We can do that, in a fraction of the time.</p>
        <Title headingLevel="h2" size="xl">
          What is a 3 point estimate?
        </Title>
        <List>
          <ListItem>
            An analytical and quantitative approach to estimate the Level of Effort (LOE) for projects
          </ListItem>
          <ListItem>Based on industry best practices</ListItem>
          <ListItem>Reduces risk that projects will be under or over sized</ListItem>
        </List>
        <Title headingLevel="h2" size="xl">
          Architects model:
        </Title>
        <List>
          <ListItem>The amount of time each task will take</ListItem>
          <ListItem>Allocate tasks to different phases of the project</ListItem>
          <ListItem>And/or different teams working in parallel</ListItem>
          <ListItem>How many consultants, with what titles and skill levels, are on each team</ListItem>
        </List>
        <Title headingLevel="h2" size="xl">
          Allows us to quickly:
        </Title>
        <List>
          <ListItem>Start with a standard solution</ListItem>
          <ListItem>Add multiple modules and/or solutions together</ListItem>
          <ListItem>Modify, remove, or add new tasks not in the standard solutions</ListItem>
          <ListItem>Run “what-if” scenarios</ListItem>
          <ListItem>How much would it cost if we had a larger/smaller team?</ListItem>
          <ListItem>Which tasks/phases are the expensive ones, and how could we change scope to reduce cost?</ListItem>
        </List>
      </div>
    </PageSection>
  </>
);

export { Dashboard };
