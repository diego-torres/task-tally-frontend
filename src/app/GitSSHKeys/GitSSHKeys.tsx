import * as React from 'react';
import {
  Alert,
  Bullseye,
  Button,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PageSection,
  Spinner,
  TextArea,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { useCredentialService } from '@api/credentials/service';
import { CredentialDto, SshKeyCreateRequest } from '@api/credentials/types';
import SSHKeysTable from './SSHKeysTable';

const GitSSHKeys: React.FunctionComponent = () => {
  const [keys, setKeys] = React.useState<CredentialDto[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [showAdd, setShowAdd] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [newKey, setNewKey] = React.useState('');
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const { listSshKeys, createSshKey, deleteSshKey } = useCredentialService();

  const refresh = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await listSshKeys('me');
      setKeys(res);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [listSshKeys]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleAdd = async () => {
    const payload: SshKeyCreateRequest = { name: newName, privateKeyPem: newKey };
    try {
      await createSshKey('me', payload);
      setShowAdd(false);
      setNewName('');
      setNewKey('');
      setSuccess('SSH key added');
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleDelete = async () => {
    try {
      for (const name of selected) {
        await deleteSshKey('me', name);
      }
      setSelected([]);
      setConfirmDelete(false);
      setSuccess('SSH key deleted');
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const onSelect = (name: string, checked: boolean) => {
    setSelected((prev) => (checked ? [...prev, name] : prev.filter((n) => n !== name)));
  };

  if (loading) {
    return (
      <PageSection>
        <Bullseye>
          <Spinner />
        </Bullseye>
      </PageSection>
    );
  }

  return (
    <PageSection>
      {error && <Alert variant="danger" title={error} isInline />}
      {success && <Alert variant="success" title={success} isInline />}
      <Toolbar style={{ marginBottom: '1rem' }}>
        <ToolbarContent>
          <ToolbarItem>
            <Button variant="primary" onClick={() => setShowAdd(true)}>
              Add Key
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Button variant="danger" onClick={() => setConfirmDelete(true)} isDisabled={selected.length === 0}>
              Delete Key
            </Button>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <SSHKeysTable
        keys={keys}
        selected={selected}
        onSelect={onSelect}
        onDelete={(name) => {
          setSelected([name]);
          setConfirmDelete(true);
        }}
      />
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} style={{ maxWidth: 500 }}>
        <ModalHeader>Add SSH key</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup label="Name" fieldId="sshkey-name">
              <TextInput id="sshkey-name" value={newName} onChange={(_, v) => setNewName(v)} />
            </FormGroup>
            <FormGroup label="Private key" fieldId="sshkey-value">
              <TextArea id="sshkey-value" value={newKey} onChange={(_, v) => setNewKey(v)} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={handleAdd} isDisabled={!newName || !newKey}>
            Add
          </Button>
          <Button variant="link" onClick={() => setShowAdd(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        style={{ maxWidth: 350, margin: '0 auto' }}
      >
        <ModalHeader>Delete SSH key</ModalHeader>
        <ModalBody>Are you sure you want to delete {selected.length} key(s)?</ModalBody>
        <ModalFooter>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="link" onClick={() => setConfirmDelete(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </PageSection>
  );
};

export { GitSSHKeys };
