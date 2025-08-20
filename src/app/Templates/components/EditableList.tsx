import * as React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  EmptyState,
  EmptyStateBody,
  Modal,
  ModalVariant,
  PageSection,
  Title,
} from '@patternfly/react-core';
import { EditIcon, PlusIcon, TrashIcon } from '@patternfly/react-icons';


export interface EditableListProps<T> {
  title: string;
  items: T[];
  onUpdate: (items: T[]) => void;
  renderItem: (item: T) => React.ReactNode;
  renderForm: (item: T | null, onSave: (item: T) => void, onCancel: () => void, formState: T, setFormState: React.Dispatch<React.SetStateAction<T>>) => React.ReactNode;
  createEmptyItem: () => T;
  getItemKey: (item: T, index: number) => string;
}

function EditableList<T>({
  title,
  items,
  onUpdate,
  renderItem,
  renderForm,
  createEmptyItem,
  getItemKey,
}: EditableListProps<T>) {
  const [editingItem, setEditingItem] = React.useState<T | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [formState, setFormState] = React.useState<T>(createEmptyItem());

  const handleAdd = () => {
    const newItem = createEmptyItem();
    setEditingItem(newItem);
    setFormState(newItem);
    setIsModalOpen(true);
  };

  const handleEdit = (item: T) => {
    setEditingItem({ ...item });
    setFormState({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate(newItems);
  };

  const handleSave = (item: T) => {
    if (editingItem) {
      const index = items.findIndex((_, i) => getItemKey(items[i], i) === getItemKey(editingItem, -1));
      if (index >= 0) {
        // Edit existing item
        const newItems = [...items];
        newItems[index] = item;
        onUpdate(newItems);
      } else {
        // Add new item
        onUpdate([...items, item]);
      }
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <>
      <PageSection>
        <Card>
          <CardHeader>
            <CardTitle>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title headingLevel="h2" size="lg">
                  {title}
                </Title>
                <Button
                  variant="primary"
                  icon={<PlusIcon />}
                  onClick={handleAdd}
                  aria-label={`Add ${title.toLowerCase()}`}
                >
                  Add {title.slice(0, -1)}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardBody>
            {items.length === 0 ? (
              <EmptyState>
                <Title headingLevel="h4" size="lg">
                  No {title.toLowerCase()} defined
                </Title>
                <EmptyStateBody>
                  Start by adding your first {title.slice(0, -1).toLowerCase()}.
                </EmptyStateBody>
                <Button variant="primary" onClick={handleAdd}>
                  Add {title.slice(0, -1)}
                </Button>
              </EmptyState>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {items.map((item, index) => (
                  <div
                    key={getItemKey(item, index)}
                    style={{
                      border: '1px solid var(--pf-global--BorderColor--100)',
                      borderRadius: 'var(--pf-global--BorderRadius--sm)',
                      padding: '1rem',
                      position: 'relative',
                    }}
                  >
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                      <Button
                        variant="plain"
                        icon={<EditIcon />}
                        onClick={() => handleEdit(item)}
                        aria-label={`Edit ${title.slice(0, -1).toLowerCase()}`}
                        style={{ marginRight: '0.5rem' }}
                      />
                      <Button
                        variant="plain"
                        icon={<TrashIcon />}
                        onClick={() => handleDelete(index)}
                        aria-label={`Delete ${title.slice(0, -1).toLowerCase()}`}
                      />
                    </div>
                    {renderItem(item)}
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </PageSection>

              <Modal
          variant={ModalVariant.large}
          title={`${editingItem ? 'Edit' : 'Add'} ${title.slice(0, -1)}`}
          isOpen={isModalOpen}
          onClose={handleCancel}
        >
        {editingItem && renderForm(editingItem, handleSave, handleCancel, formState, setFormState)}
      </Modal>
    </>
  );
}

export default EditableList;
