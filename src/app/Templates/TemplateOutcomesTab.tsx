import * as React from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  PageSection,
  TextArea,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { PlusIcon, SaveIcon, TrashIcon } from '@patternfly/react-icons';
import { useTemplateService } from '@api/templates/service';
import { OutcomeDto, PhaseDto } from '@api/templates/types';
import { useAuth } from '@app/utils/AuthContext';

interface TemplateOutcomesTabProps {
  templateId: number;
}

interface EditableOutcome extends OutcomeDto {
  isNew?: boolean;
  isEditing?: boolean;
}

// Predefined outcome prefix options
const OUTCOME_PREFIX_OPTIONS = [
  'client has:',
  'client has demonstrated:',
  'client has an understanding of:',
];

// Storage key for persisting form data during token refresh
const getStorageKey = (templateId: number) => `template-outcomes-${templateId}`;

const TemplateOutcomesTab: React.FC<TemplateOutcomesTabProps> = ({ templateId }) => {
  const { user } = useAuth();
  const templateService = useTemplateService();
  
  const [outcomes, setOutcomes] = React.useState<EditableOutcome[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  // Load outcomes from localStorage on component mount
  const loadFromStorage = React.useCallback(() => {
    try {
      const storageKey = getStorageKey(templateId);
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load outcomes from storage:', err);
    }
    return null;
  }, [templateId]);

  // Save outcomes to localStorage
  const saveToStorage = React.useCallback((outcomesData: EditableOutcome[]) => {
    try {
      const storageKey = getStorageKey(templateId);
      localStorage.setItem(storageKey, JSON.stringify(outcomesData));
    } catch (err) {
      console.warn('Failed to save outcomes to storage:', err);
    }
  }, [templateId]);

  // Clear storage when saving is successful
  const clearStorage = React.useCallback(() => {
    try {
      const storageKey = getStorageKey(templateId);
      localStorage.removeItem(storageKey);
    } catch (err) {
      console.warn('Failed to clear outcomes storage:', err);
    }
  }, [templateId]);

  const loadOutcomes = React.useCallback(async () => {
    if (!user?.preferred_username) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // First try to load from localStorage (for unsaved changes during token refresh)
      const storedOutcomes = loadFromStorage();
      
      if (storedOutcomes && storedOutcomes.length > 0) {
        // If we have stored data, use it and mark as having unsaved changes
        setOutcomes(storedOutcomes);
        setHasUnsavedChanges(true);
        setLoading(false);
        return;
      }
      
      // Otherwise load from API
      const loadedOutcomes = await templateService.listOutcomes(user.preferred_username, templateId);
      const outcomesWithFlags = loadedOutcomes.map(o => ({ ...o, isNew: false, isEditing: false }));
      setOutcomes(outcomesWithFlags);
      setHasUnsavedChanges(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load outcomes');
    } finally {
      setLoading(false);
    }
  }, [user?.preferred_username, templateId, templateService, loadFromStorage]);

  // Load outcomes on component mount
  React.useEffect(() => {
    if (user?.preferred_username && templateId) {
      loadOutcomes();
    }
  }, [user?.preferred_username, templateId, loadOutcomes]);

  // Save to localStorage whenever outcomes change
  React.useEffect(() => {
    if (outcomes.length > 0 || hasUnsavedChanges) {
      saveToStorage(outcomes);
    }
  }, [outcomes, hasUnsavedChanges, saveToStorage]);

  // Warn user when leaving with unsaved changes
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const createEmptyOutcome = (): EditableOutcome => ({
    phase: {
      name: '',
      track: '',
      product: '',
      environment: '',
    },
    prefix: '',
    description: '',
    notes: '',
    isNew: true,
    isEditing: true,
  });

  const handleAddOutcome = () => {
    const newOutcome = createEmptyOutcome();
    setOutcomes(prev => [...prev, newOutcome]);
    setHasUnsavedChanges(true);
  };

  const handleUpdateOutcome = (index: number, field: keyof OutcomeDto | 'phase.name' | 'phase.track' | 'phase.product' | 'phase.environment', value: string) => {
    setOutcomes(prev => {
      const updated = [...prev];
      const outcome = { ...updated[index] };
      
      if (field.startsWith('phase.')) {
        const phaseField = field.split('.')[1] as keyof PhaseDto;
        outcome.phase = { ...outcome.phase, [phaseField]: value };
      } else if (field === 'prefix' || field === 'description' || field === 'notes') {
        (outcome as OutcomeDto)[field] = value;
      }
      
      updated[index] = outcome;
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  const handleDeleteOutcome = (index: number) => {
    setOutcomes(prev => {
      const updated = prev.filter((_, i) => i !== index);
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  const handleSaveAll = async () => {
    if (!user?.preferred_username) return;
    
    try {
      setSaving(true);
      setError(null);
      
      // Get outcomes that need to be created (new ones)
      const newOutcomes = outcomes.filter(o => o.isNew && !o.isEditing);
      const existingOutcomes = outcomes.filter(o => !o.isNew);
      
      // Create new outcomes
      for (const outcome of newOutcomes) {
        const { phase, prefix, description, notes } = outcome;
        await templateService.createOutcome(user.preferred_username, templateId, { phase, prefix, description, notes });
      }
      
      // Update existing outcomes
      for (const outcome of existingOutcomes) {
        if (outcome.id) {
          const { phase, prefix, description, notes } = outcome;
          await templateService.updateOutcome(user.preferred_username, templateId, outcome.id, { phase, prefix, description, notes });
        }
      }
      
      // Reload outcomes to get updated IDs
      await loadOutcomes();
      setHasUnsavedChanges(false);
      clearStorage(); // Clear storage after successful save
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save outcomes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageSection>
        <Card>
          <CardBody>Loading outcomes...</CardBody>
        </Card>
      </PageSection>
    );
  }

  return (
    <PageSection>
      <Card>
        <CardHeader>
          <CardTitle>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title headingLevel="h2" size="lg">
                Outcomes
              </Title>
              <div>
                <Button
                  variant="primary"
                  icon={<PlusIcon />}
                  onClick={handleAddOutcome}
                  aria-label="Add outcome"
                  style={{ marginRight: '0.5rem' }}
                >
                  Add Outcome
                </Button>
                <Button
                  variant="secondary"
                  icon={<SaveIcon />}
                  onClick={handleSaveAll}
                  isDisabled={!hasUnsavedChanges || saving}
                  aria-label="Save all outcomes"
                >
                  {saving ? 'Saving...' : 'Save All'}
                </Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardBody>
          {error && (
            <Alert variant="danger" title="Error" style={{ marginBottom: '1rem' }}>
              {error}
            </Alert>
          )}
          
          {hasUnsavedChanges && (
            <Alert variant="warning" title="Unsaved Changes" style={{ marginBottom: '1rem' }}>
              You have unsaved changes. Please save your outcomes before leaving this tab.
            </Alert>
          )}

          {outcomes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No outcomes defined. Click &quot;Add Outcome&quot; to get started.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="pf-c-table pf-m-compact pf-m-grid-md" role="grid" style={{ width: '100%', minWidth: '800px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Actions</th>
                    <th style={{ width: '15%' }}>Phase</th>
                    <th style={{ width: '15%' }}>Track</th>
                    <th style={{ width: '15%' }}>Product</th>
                    <th style={{ width: '15%' }}>Environment</th>
                    <th style={{ width: '15%' }}>Prefix</th>
                    <th style={{ width: '25%' }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {outcomes.map((outcome, index) => (
                    <tr key={index}>
                      <td>
                        <Button
                          variant="plain"
                          icon={<TrashIcon />}
                          onClick={() => handleDeleteOutcome(index)}
                          aria-label={`Delete outcome ${index + 1}`}
                        />
                      </td>
                      <td>
                        <TextInput
                          id={`phase-name-${index}`}
                          value={outcome.phase.name}
                          onChange={(_, value) => handleUpdateOutcome(index, 'phase.name', value)}
                          placeholder="Phase name"
                          isDisabled={!outcome.isEditing}
                        />
                      </td>
                      <td>
                        <TextInput
                          id={`track-${index}`}
                          value={outcome.phase.track}
                          onChange={(_, value) => handleUpdateOutcome(index, 'phase.track', value)}
                          placeholder="Track"
                          isDisabled={!outcome.isEditing}
                        />
                      </td>
                      <td>
                        <TextInput
                          id={`product-${index}`}
                          value={outcome.phase.product}
                          onChange={(_, value) => handleUpdateOutcome(index, 'phase.product', value)}
                          placeholder="Product"
                          isDisabled={!outcome.isEditing}
                        />
                      </td>
                      <td>
                        <TextInput
                          id={`environment-${index}`}
                          value={outcome.phase.environment}
                          onChange={(_, value) => handleUpdateOutcome(index, 'phase.environment', value)}
                          placeholder="Environment"
                          isDisabled={!outcome.isEditing}
                        />
                      </td>
                      <td>
                        <select
                          id={`prefix-${index}`}
                          value={outcome.prefix}
                          onChange={(e) => handleUpdateOutcome(index, 'prefix', e.target.value)}
                          disabled={!outcome.isEditing}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '3px' }}
                        >
                          <option value="">Select prefix</option>
                          {OUTCOME_PREFIX_OPTIONS.map((option, optionIndex) => (
                            <option key={optionIndex} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <TextArea
                          id={`description-${index}`}
                          value={outcome.description}
                          onChange={(_, value) => handleUpdateOutcome(index, 'description', value)}
                          placeholder="Description"
                          isDisabled={!outcome.isEditing}
                          rows={2}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </PageSection>
  );
};

export default TemplateOutcomesTab;
