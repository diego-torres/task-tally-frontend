import * as React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  EmptyState,
  EmptyStateBody,
  PageSection,
  Title,
} from '@patternfly/react-core';
import { PlusIcon } from '@patternfly/react-icons';
import { TeamModeling } from '@api/templates/types';

interface TemplateTeamModelingTabProps {
  teamModeling: TeamModeling[];
  onUpdate: (teamModeling: TeamModeling[]) => void;
}

const TemplateTeamModelingTab: React.FC<TemplateTeamModelingTabProps> = ({ 
  teamModeling, 
  onUpdate 
}) => {
  const createEmptyTeamModeling = (): TeamModeling => ({
    role: '',
    phase: '',
    track: '',
    percentage: 0,
  });

  const renderTeamModeling = (item: TeamModeling) => (
    <DescriptionList isHorizontal>
      <DescriptionListGroup>
        <DescriptionListTerm>Role</DescriptionListTerm>
        <DescriptionListDescription>{item.role}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Phase</DescriptionListTerm>
        <DescriptionListDescription>{item.phase}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Track</DescriptionListTerm>
        <DescriptionListDescription>{item.track}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Percentage</DescriptionListTerm>
        <DescriptionListDescription>{item.percentage}%</DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );



  const getTeamModelingKey = (item: TeamModeling, index: number) => 
    `${item.role}-${item.phase}-${item.track}-${index}`;

  // Group team modeling by role for better visualization
  const groupedByRole = teamModeling.reduce((acc, item) => {
    if (!acc[item.role]) {
      acc[item.role] = [];
    }
    acc[item.role].push(item);
    return acc;
  }, {} as Record<string, TeamModeling[]>);

  return (
    <PageSection>
      <Card>
        <CardHeader>
          <CardTitle>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title headingLevel="h2" size="lg">
                Team Modeling
              </Title>
              <Button
                variant="primary"
                icon={<PlusIcon />}
                onClick={() => {
                  const newItem = createEmptyTeamModeling();
                  onUpdate([...teamModeling, newItem]);
                }}
                aria-label="Add team modeling"
              >
                Add Team Modeling
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardBody>
                     {teamModeling.length === 0 ? (
             <EmptyState>
               <Title headingLevel="h4" size="lg">
                 No team modeling defined
               </Title>
               <EmptyStateBody>
                 Start by adding team modeling entries to define how each role allocates time across phases and tracks.
               </EmptyStateBody>
               <Button variant="primary" onClick={() => {
                 const newItem = createEmptyTeamModeling();
                 onUpdate([...teamModeling, newItem]);
               }}>
                 Add Team Modeling
               </Button>
             </EmptyState>
           ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {Object.entries(groupedByRole).map(([role, items]) => (
                <div key={role}>
                  <Title headingLevel="h3" size="md" style={{ marginBottom: '1rem' }}>
                    {role}
                  </Title>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                         {items.map((item) => {
                       const globalIndex = teamModeling.findIndex(tm => 
                         tm.role === item.role && 
                         tm.phase === item.phase && 
                         tm.track === item.track
                       );
                      return (
                        <div
                          key={getTeamModelingKey(item, globalIndex)}
                          style={{
                            border: '1px solid var(--pf-global--BorderColor--100)',
                            borderRadius: 'var(--pf-global--BorderRadius--sm)',
                            padding: '1rem',
                            position: 'relative',
                          }}
                        >
                          <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                            <Button
                              variant="plain"
                              icon={<PlusIcon />}
                              onClick={() => {
                                const newItem = createEmptyTeamModeling();
                                onUpdate([...teamModeling, newItem]);
                              }}
                              aria-label="Edit team modeling"
                              style={{ marginRight: '0.5rem' }}
                            />
                            <Button
                              variant="plain"
                              icon={<PlusIcon />}
                              onClick={() => {
                                const newItems = teamModeling.filter((_, i) => i !== globalIndex);
                                onUpdate(newItems);
                              }}
                              aria-label="Delete team modeling"
                            />
                          </div>
                          {renderTeamModeling(item)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </PageSection>
  );
};

export default TemplateTeamModelingTab;
