import * as React from 'react';
import { Button, ButtonVariant, Checkbox } from '@patternfly/react-core';
import { DownloadIcon, TrashIcon } from '@patternfly/react-icons';
import { CredentialDto } from '@api/credentials/types';
import { formatDate } from '@lib/formatters';

export interface SSHKeysTableProps {
  keys: CredentialDto[];
  selected: string[];
  onSelect: (name: string, checked: boolean) => void;
  onDelete: (name: string) => void;
  onDownload: (name: string) => void;
}

const SSHKeysTable: React.FC<SSHKeysTableProps> = ({ keys, selected, onSelect, onDelete, onDownload }) => (
  <div style={{ overflowX: 'auto' }}>
    <table className="pf-c-table pf-m-compact pf-m-grid-md" role="grid" style={{ width: '100%', minWidth: '600px' }}>
      <thead>
        <tr>
          <th style={{ width: '80px' }}>Actions</th>
          <th style={{ width: '60px' }}></th>
          <th>Name</th>
          <th>Fingerprint</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {keys.map((k) => (
          <tr key={k.name}>
            <td>
              <Button variant={ButtonVariant.link} aria-label="Download public key" onClick={() => onDownload(k.name || '')}>
                <DownloadIcon />
              </Button>
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
            <td>{k.fingerprint || '-'}</td>
            <td>{k.createdAt ? formatDate(k.createdAt) : '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SSHKeysTable;
