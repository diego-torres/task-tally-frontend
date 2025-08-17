import * as React from 'react';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { EyeIcon, PencilAltIcon, TrashIcon } from '@patternfly/react-icons';
import { TemplateDto } from '@api/templates/types';
import { formatDate } from '@lib/formatters';

export interface TemplatesTableProps {
  templates: TemplateDto[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TemplatesTable: React.FC<TemplatesTableProps> = ({ templates, onView, onEdit, onDelete }) => (
  <div style={{ overflowX: 'auto' }}>
    <table className="pf-c-table pf-m-compact pf-m-grid-md" role="grid" style={{ width: '100%', minWidth: '600px' }}>
      <thead>
        <tr>
          <th style={{ width: '120px' }}>Actions</th>
          <th>Name</th>
          <th>Provider</th>
          <th>Repo</th>
          <th>Branch</th>
          <th>Updated</th>
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
            <td>{t.sshRepoUri}</td>
            <td>{t.defaultBranch}</td>
            <td>{t.updatedAt ? formatDate(t.updatedAt) : '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TemplatesTable;
