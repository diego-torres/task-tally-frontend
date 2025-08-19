import * as React from 'react';
import {
  Alert,
  AlertGroup,
  Bullseye,
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
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
import { useAuth } from '../utils/AuthContext';
import { CredentialDto, SshKeyGenerateRequest } from '@api/credentials/types';
import SSHKeysTable from './SSHKeysTable';

const GitSSHKeys: React.FunctionComponent = () => {
  const [keys, setKeys] = React.useState<CredentialDto[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [showAdd, setShowAdd] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [newProvider, setNewProvider] = React.useState<'github' | 'gitlab'>('github');
  const [newComment, setNewComment] = React.useState('');
  const [newPassphrase, setNewPassphrase] = React.useState('');
  const [newKnownHosts, setNewKnownHosts] = React.useState('');
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [copying, setCopying] = React.useState<string | null>(null);

  const { listSshKeys, generateSshKey, deleteSshKey, getPublicKey } = useCredentialService();
  const { user } = useAuth();
  const username = user?.preferred_username;

  const refresh = React.useCallback(async () => {
    if (!username) return;
    try {
      setLoading(true);
      const res = await listSshKeys(username);
      setKeys(res);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [listSshKeys, username]);

  // Only request credentials once when the page loads
  React.useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async () => {
    if (!username) return;
    const payload: SshKeyGenerateRequest = {
      name: newName,
      provider: newProvider,
      comment: newComment || undefined,
      passphrase: newPassphrase || undefined,
      knownHosts: newKnownHosts || undefined,
    };
    try {
      await generateSshKey(username, payload);
      setShowAdd(false);
      setNewName('');
      setNewComment('');
      setNewPassphrase('');
      setNewKnownHosts('');
      setSuccess('SSH key generated');
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleDelete = async () => {
    try {
      for (const name of selected) {
        await deleteSshKey(username || '', name);
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
    <>
      {success && (
        <AlertGroup isToast isLiveRegion>
          <Alert variant="success" title={success} timeout={3000} onTimeout={() => setSuccess(null)} />
        </AlertGroup>
      )}
      {error && (
        <AlertGroup isToast isLiveRegion>
          <Alert variant="danger" title={error} timeout={5000} onTimeout={() => setError(null)} />
        </AlertGroup>
      )}
      <PageSection>
        <Toolbar style={{ marginBottom: '1rem' }}>
          <ToolbarContent>
            <ToolbarItem>
              <Button variant="primary" onClick={() => setShowAdd(true)}>
                Generate Key
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
          copying={copying}
          onSelect={onSelect}
          onDelete={(name) => {
            setSelected([name]);
            setConfirmDelete(true);
          }}
          onCopy={async (name) => {
            if (username) {
              try {
                setCopying(name);
                const { publicKey } = await getPublicKey(username, name);
                
                // Copy to clipboard
                await navigator.clipboard.writeText(publicKey);
                setSuccess('Public key copied to clipboard');
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setCopying(null);
              }
            }
          }}
        />
        <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} style={{ maxWidth: 500 }}>
          <ModalHeader>Generate SSH key</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup label="Name" fieldId="sshkey-name" isRequired>
                <TextInput id="sshkey-name" value={newName} onChange={(_, v) => setNewName(v)} />
              </FormGroup>
              <FormGroup label="Provider" fieldId="sshkey-provider" isRequired>
                <FormSelect
                  id="sshkey-provider"
                  value={newProvider}
                  onChange={(_, v) => setNewProvider(v as 'github' | 'gitlab')}
                >
                  <FormSelectOption value="github" label="GitHub" />
                  <FormSelectOption value="gitlab" label="GitLab" />
                </FormSelect>
              </FormGroup>
              <FormGroup label="Comment" fieldId="sshkey-comment">
                <TextInput id="sshkey-comment" value={newComment} onChange={(_, v) => setNewComment(v)} />
              </FormGroup>
              <FormGroup label="Passphrase" fieldId="sshkey-passphrase">
                <TextInput
                  id="sshkey-passphrase"
                  type="password"
                  value={newPassphrase}
                  onChange={(_, v) => setNewPassphrase(v)}
                />
              </FormGroup>
              <FormGroup label="Known hosts" fieldId="sshkey-knownhosts">
                <TextArea id="sshkey-knownhosts" value={newKnownHosts} onChange={(_, v) => setNewKnownHosts(v)} />
                <p className="pf-c-form__helper-text">e.g. output of `ssh-keyscan github.com`</p>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button variant="primary" onClick={handleGenerate} isDisabled={!newName}>
              Generate
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
    </>
  );
};

export { GitSSHKeys };
