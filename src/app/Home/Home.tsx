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
    {/* Templates & Proposals Infographic */}
    <PageSection variant="secondary">
      <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }}>
        <Title headingLevel="h2" size="lg" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Templates & Proposals Overview
        </Title>
        <svg width="800" height="260" viewBox="0 0 800 260" style={{ maxWidth: '100%', height: 'auto', marginBottom: '1rem' }}>
          {/* Templates box - wider */}
          <rect x="3" y="40" width="240" height="80" rx="15" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2" />
          <text x="140" y="70" textAnchor="middle" fontSize="18" fill="#1976d2" fontWeight="bold">Templates</text>
          <text x="122" y="95" textAnchor="middle" fontSize="13" fill="#1976d2">Reusable groups of tasks, outcomes, etc.</text>

          {/* Arrow from Templates to Proposals - moved 20px left from previous */}
          <polygon points="250,80 290,80 290,70 320,90 290,110 290,100 250,100" fill="#1976d2" />
          <text x="285" y="65" textAnchor="middle" fontSize="12" fill="#1976d2">can create</text>

          {/* Proposals box - wider */}
          <rect x="320" y="40" width="240" height="80" rx="15" fill="#fff3e0" stroke="#f57c00" strokeWidth="2" />
          <text x="440" y="70" textAnchor="middle" fontSize="18" fill="#f57c00" fontWeight="bold">Proposals</text>
          <text x="440" y="95" textAnchor="middle" fontSize="13" fill="#f57c00">Estimate project effort</text>
          <text x="440" y="112" textAnchor="middle" fontSize="13" fill="#f57c00">Composed of templates + custom tasks</text>

          {/* Additional tasks box - now under Proposals */}
          <rect x="350" y="140" width="210" height="60" rx="12" fill="#fce4ec" stroke="#c2185b" strokeWidth="2" />
          <text x="460" y="170" textAnchor="middle" fontSize="15" fill="#c2185b" fontWeight="bold">Additional Tasks/Elements</text>
          <text x="460" y="190" textAnchor="middle" fontSize="12" fill="#c2185b">Specific to each project proposal</text>

          {/* Arrow from Additional Tasks to Proposals - vertical arrow above box */}
          <polygon points="460,140 460,130 455,130 460,120 465,130 460,130" fill="#c2185b" />
        </svg>
        <div style={{ maxWidth: '500px', textAlign: 'center' }}>
          <p style={{ fontSize: '1rem' }}>
            <strong>Templates</strong> describe reusable groups of tasks, outcomes, and more.<br />
            <strong>Proposals</strong> estimate project effort, combining one or more templates and additional tasks unique to the project.
          </p>
        </div>
      </Flex>
    </PageSection>
    {/* Infographic Section */}
    <PageSection>
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
