import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { useToast } from '@/shared/components/ui/use-toast';
import {
  TableFormData,
  TableColumn,
  TableConstraint,
  PostgresDataType,
  validateTableForm,
} from '@/shared/types/table';

interface TableFormProps {
  onSubmit: (data: TableFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<TableFormData>;
}

export function TableForm({ onSubmit, onCancel, initialData }: TableFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TableFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    columns: initialData?.columns || [{ name: '', type: 'text', nullable: true }],
    constraints: initialData?.constraints || [],
  });

  const handleAddColumn = () => {
    setFormData((prev) => ({
      ...prev,
      columns: [...prev.columns, { name: '', type: 'text', nullable: true }],
    }));
  };

  const handleRemoveColumn = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== index),
    }));
  };

  const handleColumnChange = (index: number, field: keyof TableColumn, value: any) => {
    setFormData((prev) => ({
      ...prev,
      columns: prev.columns.map((col, i) =>
        i === index ? { ...col, [field]: value } : col
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data
      const validationErrors = validateTableForm(formData);
      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => {
          toast({
            title: "Validation Error",
            description: `${error.field}: ${error.message}`,
            variant: "destructive"
          });
        });
        return;
      }

      // Log form data for debugging
      (window as any).debugConsole?.form('Table Form Data', formData);

      // Submit form data
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create table",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Table Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Enter table name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Enter table description"
        />
      </div>

      <div className="space-y-4">
        <Label>Columns</Label>
        {formData.columns.map((column, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1 space-y-2">
              <Input
                value={column.name}
                onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
                placeholder="Column name"
                required
              />
            </div>
            <div className="flex-1 space-y-2">
              <select
                value={column.type}
                onChange={(e) =>
                  handleColumnChange(index, 'type', e.target.value as PostgresDataType)
                }
                className="w-full p-2 border rounded"
                required
              >
                <option value="text">Text</option>
                <option value="integer">Integer</option>
                <option value="boolean">Boolean</option>
                <option value="timestamp">Timestamp</option>
                <option value="numeric">Numeric</option>
                <option value="json">JSON</option>
                <option value="uuid">UUID</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                checked={!column.nullable}
                onChange={(e) =>
                  handleColumnChange(index, 'nullable', !e.target.checked)
                }
                id={`required-${index}`}
              />
              <Label htmlFor={`required-${index}`}>Required</Label>
            </div>
            {formData.columns.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveColumn(index)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" onClick={handleAddColumn}>
          Add Column
        </Button>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Table</Button>
      </div>
    </form>
  );
}
