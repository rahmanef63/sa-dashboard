import React from 'react';
import { SubMenuItem } from '@/slices/sidebar/menu/types';
import { SubMenuItemFormProps } from '@/slices/sidebar/menu/types/forms';
import { Button } from 'shared/components/ui/button';
import { Input } from 'shared/components/ui/input';
import { Label } from 'shared/components/ui/label';

export function SubMenuItemForm({ item, parentId, onSave, onCancel }: SubMenuItemFormProps) {
  const [formData, setFormData] = React.useState<Partial<SubMenuItem>>({
    id: item?.id || '',
    name: item?.name || '',
    path: item?.path || '',
    parentId: parentId || item?.parentId || '',
    url: item?.url || { path: '', label: '' }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.path && formData.parentId) {
      onSave({
        ...formData,
        id: formData.id || crypto.randomUUID(),
        parentId: formData.parentId,
        path: formData.path,
        name: formData.name,
        url: formData.url
      } as SubMenuItem);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      url: {
        ...prev.url,
        [name]: value
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="path">Path</Label>
        <Input
          type="text"
          id="path"
          name="path"
          value={formData.path}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="url.path">URL Path</Label>
        <Input
          type="text"
          id="url.path"
          name="path"
          value={formData.url?.path || ''}
          onChange={handleUrlChange}
        />
      </div>
      <div>
        <Label htmlFor="url.label">URL Label</Label>
        <Input
          type="text"
          id="url.label"
          name="label"
          value={formData.url?.label || ''}
          onChange={handleUrlChange}
        />
      </div>
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="default">
          Save
        </Button>
      </div>
    </form>
  );
}
