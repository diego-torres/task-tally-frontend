import * as React from 'react';
import {
  Button,
  ButtonVariant,
} from '@patternfly/react-core';
import { TemplateDto } from '@api/templates/types';
import { formatDate } from '@lib/formatters';

export interface TemplatesTableProps {
  templates: TemplateDto[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TemplatesTable: React.FC<TemplatesTableProps> = ({
  templates,
  onView,
  onEdit,
  onDelete,
}) => (
  <table className="pf-c-table pf-m-compact" role="grid">
    <thead>
      <tr>
        <th>Name</th>
        <th>Provider</th>
        <th>Repo</th>
        <th>Branch</th>
        <th>Updated</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {templates.map((t) => (
        <tr key={t.id}>
          <td>{t.name}</td>
          <td>{t.provider}</td>
          <td>{t.sshRepoUri}</td>
          <td>{t.defaultBranch}</td>
          <td>{formatDate(t.updatedAt)}</td>
          <td>
            <Button variant={ButtonVariant.link} onClick={() => onView(t.id)}>
              View
            </Button>
            <Button variant={ButtonVariant.link} onClick={() => onEdit(t.id)}>
              Edit
            </Button>
            <Button variant={ButtonVariant.link} onClick={() => onDelete(t.id)}>
              Delete
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default TemplatesTable;
