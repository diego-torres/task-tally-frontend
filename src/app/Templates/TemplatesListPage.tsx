import * as React from 'react';
import { Alert, AlertActionCloseButton, Button, EmptyState, EmptyStateBody, Modal, ModalBody, ModalFooter, ModalHeader, PageSection, Spinner } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { useNavigate } from '@lib/router';
import TemplatesTable from './TemplatesTable';
import { useTemplateService } from '@api/templates/service';
import { TemplateDto } from '@api/templates/types';
import { useAuth } from '@app/utils/AuthContext';

const TemplatesListPage: React.FC = () => {
  const navigate = useNavigate();
  const { listTemplates, deleteTemplate } = useTemplateService();
  const { user } = useAuth();
  const username = user?.preferred_username;
  const [templates, setTemplates] = React.useState<TemplateDto[]>([]);
  const [toDelete, setToDelete] = React.useState<TemplateDto | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    if (!username) return;
    try {
      setLoading(true);
      setError(null);
      const res = await listTemplates(username);
      setTemplates(res);
    } catch (err) {
      console.error('Failed to load templates:', err);
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  }, [listTemplates, username]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const confirmDelete = async () => {
    if (toDelete && username) {
      try {
        await deleteTemplate(username, toDelete.id);
        setToDelete(null);
        void refresh();
      } catch (err) {
        console.error('Failed to delete template:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete template');
      }
    }
  };

  const handleRetry = () => {
    void refresh();
  };

  return (
    <PageSection>
      {error && (
        <Alert
          variant="danger"
          title="Error loading templates"
          actionClose={<AlertActionCloseButton onClose={() => setError(null)} />}
          actionLinks={
            <Button variant="link" onClick={handleRetry}>
              Retry
            </Button>
          }
          style={{ marginBottom: '1rem' }}
        >
          {error}
        </Alert>
      )}
      
      {!loading && !error && templates.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <Button variant="primary" onClick={() => navigate('/templates/new')}>
            New Template
          </Button>
        </div>
      )}
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Spinner size="lg" aria-label="Loading templates" />
          <div style={{ marginTop: '1rem' }}>Loading templates...</div>
        </div>
      ) : !error && templates.length === 0 ? (
        <EmptyState>
          <CubesIcon />
          <EmptyStateBody>
            No templates found. Create your first template to get started.
          </EmptyStateBody>
          <Button variant="primary" onClick={() => navigate('/templates/new')}>
            Create Template
          </Button>
        </EmptyState>
      ) : !error && (
        <TemplatesTable
          templates={templates}
          onView={(id) => navigate(`/templates/${id}`)}
          onEdit={(id) => navigate(`/templates/${id}/edit`)}
          onDelete={(id) => {
            const tpl = templates.find((t) => t.id === id) || null;
            setToDelete(tpl);
          }}
        />
      )}
      
      <Modal isOpen={!!toDelete} onClose={() => setToDelete(null)} style={{ maxWidth: 350, margin: '0 auto' }}>
        <ModalHeader>Delete template</ModalHeader>
        <ModalBody>
          Are you sure you want to delete <b>{toDelete?.name}</b>?
        </ModalBody>
        <ModalFooter>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
          <Button variant="link" onClick={() => setToDelete(null)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </PageSection>
  );
};

export default TemplatesListPage;
