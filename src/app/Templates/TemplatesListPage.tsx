import * as React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PageSection,
} from '@patternfly/react-core';
import { useNavigate } from '@lib/router';
import TemplatesTable from './TemplatesTable';
import { deleteTemplate, listTemplates } from '@api/templates/service';
import { TemplateDto } from '@api/templates/types';

const TemplatesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = React.useState<TemplateDto[]>([]);
  const [toDelete, setToDelete] = React.useState<TemplateDto | null>(null);

  const refresh = React.useCallback(async () => {
    const res = await listTemplates();
    setTemplates(res.items);
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const confirmDelete = async () => {
    if (toDelete) {
      await deleteTemplate(toDelete.id);
      setToDelete(null);
      void refresh();
    }
  };

  return (
    <PageSection>
      <div style={{ marginBottom: '1.5rem' }}>
        <Button
          variant="primary"
          onClick={() => navigate('/templates/new')}
        >
          Create template
        </Button>
      </div>
      <TemplatesTable
        templates={templates}
        onView={(id) => navigate(`/templates/${id}`)}
        onEdit={(id) => navigate(`/templates/${id}/edit`)}
        onDelete={(id) => {
          const tpl = templates.find((t) => t.id === id) || null;
          setToDelete(tpl);
        }}
      />
      <Modal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        style={{ maxWidth: 350, margin: '0 auto' }}
      >
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
