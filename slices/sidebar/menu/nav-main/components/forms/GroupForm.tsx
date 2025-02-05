import React from 'react';
import { Button } from "shared/components/ui/button"
import { Input } from "shared/components/ui/input"
import { Label } from "shared/components/ui/label"
import { GroupLabel } from '@/slices/sidebar/menu/types';
import { GroupLabelFormProps } from '@/slices/sidebar/menu/types/forms';

export function GroupForm({ label, onSave, onCancel }: GroupLabelFormProps) {
  const [formData, setFormData] = React.useState<GroupLabel>({
    id: label?.id || '',
    name: label?.name || '',
    icon: label?.icon
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-2">
      <div>
        <Label htmlFor="name">Label Name</Label>
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
        <Label htmlFor="icon">Icon (optional)</Label>
        <Input
          type="text"
          id="icon"
          name="icon"
          value={formData.icon || ''}
          onChange={handleChange}
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
