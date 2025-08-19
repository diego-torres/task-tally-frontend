import * as React from 'react';
import { Button, ButtonVariant, Checkbox, Spinner } from '@patternfly/react-core';
import { CopyIcon, TrashIcon } from '@patternfly/react-icons';
import { CredentialDto } from '@api/credentials/types';
import { formatDate } from '@lib/formatters';

export interface SSHKeysTableProps {
  keys: CredentialDto[];
  selected: string[];
  copying?: string | null;
  onSelect: (name: string, checked: boolean) => void;
  onDelete: (name: string) => void;
  onCopy: (name: string) => void;
}

const SSHKeysTable: React.FC<SSHKeysTableProps> = ({ keys, selected, copying, onSelect, onDelete, onCopy }) => (
  <div style={{ overflowX: 'auto' }}>
    <table className="pf-c-table pf-m-compact pf-m-grid-md" role="grid" style={{ width: '100%', minWidth: '600px' }}>
      <thead>
        <tr>
          <th style={{ width: '80px' }}>Actions</th>
          <th style={{ width: '60px' }}></th>
          <th>Name</th>
          <th>Provider</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {keys.map((k) => (
          <tr key={k.name}>
            <td>
              {copying === k.name ? (
                <Spinner size="sm" aria-label="Copying public key to clipboard" />
              ) : (
                <Button variant={ButtonVariant.link} aria-label="Copy public key to clipboard" onClick={() => onCopy(k.name || '')}>
                  <CopyIcon />
                </Button>
              )}
              <Button variant={ButtonVariant.link} aria-label="Delete" onClick={() => onDelete(k.name || '')}>
                <TrashIcon />
              </Button>
            </td>
            <td>
              <Checkbox
                id={`select-${k.name}`}
                aria-label={`select-${k.name}`}
                isChecked={selected.includes(k.name || '')}
                onChange={(_, checked) => onSelect(k.name || '', checked)}
              />
            </td>
            <td>{k.name}</td>
            <td>{k.provider || '-'}</td>
            <td>{k.createdAt ? formatDate(k.createdAt) : '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SSHKeysTable;
