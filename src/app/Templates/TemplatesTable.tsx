import * as React from 'react';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { EyeIcon, PencilAltIcon, TrashIcon } from '@patternfly/react-icons';
import { TemplateDto } from '@api/templates/types';

export interface TemplatesTableProps {
  templates: TemplateDto[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const TemplatesTable: React.FC<TemplatesTableProps> = ({ templates, onView, onEdit, onDelete }) => (
  <div style={{ overflowX: 'auto' }}>
    <table className="pf-c-table pf-m-compact pf-m-grid-md" role="grid" style={{ width: '100%', minWidth: '600px' }}>
      <thead>
        <tr>
          <th style={{ width: '120px' }}>Actions</th>
          <th>Name</th>
          <th>Provider</th>
          <th>Repository URL</th>
          <th>Branch</th>
          <th>SSH Key</th>
        </tr>
      </thead>
      <tbody>
        {templates.map((t) => (
          <tr key={t.id}>
            <td>
              <Button variant={ButtonVariant.link} aria-label="View" onClick={() => onView(t.id)}>
                <EyeIcon />
              </Button>
              <Button variant={ButtonVariant.link} aria-label="Edit" onClick={() => onEdit(t.id)}>
                <PencilAltIcon />
              </Button>
              <Button variant={ButtonVariant.link} aria-label="Delete" onClick={() => onDelete(t.id)}>
                <TrashIcon />
              </Button>
            </td>
            <td>{t.name}</td>
            <td>{t.provider}</td>
            <td>{t.repositoryUrl}</td>
            <td>{t.defaultBranch}</td>
            <td>{t.sshKeyName || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TemplatesTable;
