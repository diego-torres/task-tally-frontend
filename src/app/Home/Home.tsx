import * as React from 'react';
import { Flex, FlexItem, List, ListItem, PageSection, Title } from '@patternfly/react-core';
import logo from '../../logo.png';

const Home: React.FunctionComponent = () => (
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
    {/* Infographic Section */}
    <PageSection variant="secondary">
      <Flex justifyContent={{ default: 'justifyContentCenter' }}>
        <FlexItem>
          <Title headingLevel="h2" size="lg" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            How Task Tally Works
          </Title>
          <Flex spaceItems={{ default: 'spaceItemsLg' }}>
            <FlexItem>
              <div style={{ textAlign: 'center' }}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="32" fill="#E0E7FF" />
                  <text x="32" y="38" textAnchor="middle" fontSize="24" fill="#3C3C3C">1</text>
                </svg>
                <Title headingLevel="h3" size="md">Define Tasks</Title>
                <p style={{ maxWidth: '120px', margin: '0 auto' }}>List all project tasks and phases.</p>
              </div>
            </FlexItem>
            <FlexItem>
              <div style={{ textAlign: 'center' }}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="32" fill="#C7F9E9" />
                  <text x="32" y="38" textAnchor="middle" fontSize="24" fill="#3C3C3C">2</text>
                </svg>
                <Title headingLevel="h3" size="md">Estimate Effort</Title>
                <p style={{ maxWidth: '120px', margin: '0 auto' }}>Use 3-point estimates to assess LOE and risk.</p>
              </div>
            </FlexItem>
            <FlexItem>
              <div style={{ textAlign: 'center' }}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="32" fill="#FFD6E0" />
                  <text x="32" y="38" textAnchor="middle" fontSize="24" fill="#3C3C3C">3</text>
                </svg>
                <Title headingLevel="h3" size="md">Model Teams</Title>
                <p style={{ maxWidth: '120px', margin: '0 auto' }}>Assign consultants, teams, and skill levels.</p>
              </div>
            </FlexItem>
            <FlexItem>
              <div style={{ textAlign: 'center' }}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="32" fill="#FFFACD" />
                  <text x="32" y="38" textAnchor="middle" fontSize="24" fill="#3C3C3C">4</text>
                </svg>
                <Title headingLevel="h3" size="md">Analyze &amp; Adjust</Title>
                <p style={{ maxWidth: '120px', margin: '0 auto' }}>Run scenarios, adjust scope, and optimize cost.</p>
              </div>
            </FlexItem>
          </Flex>
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

export { Home };
