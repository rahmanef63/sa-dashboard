import { DatabaseTable } from "shared/types/global";
import DataTable from "shared/components/DataTable";
import { Button } from "shared/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "shared/components/ui/dialog";
import { Input } from "shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select";
import { showToast } from "shared/utils/toast";

interface TablePreviewProps {
  table: DatabaseTable;
}

export const TablePreview = ({ table }: TablePreviewProps) => {
  const [previewData, setPreviewData] = useState<any[]>([
    { id: 1, ...generateSampleData(table.columns) },
    { id: 2, ...generateSampleData(table.columns) },
    { id: 3, ...generateSampleData(table.columns) },
  ]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState<Record<string, any>>({});

  const columns = table.columns.map((col) => ({
    key: col.name as keyof any,
    header: col.name,
    render: (value: any) => {
      if (col.type === "boolean") return value ? "Yes" : "No";
      if (col.type === "date") return new Date(value).toLocaleDateString();
      return String(value);
    },
  }));

  const handleAddRow = () => {
    const newRow = {
      id: previewData.length + 1,
      ...generateSampleData(table.columns),
    };
    setPreviewData([...previewData, newRow]);
    showToast.success("Row added successfully");
  };

  const handleEditClick = (row: any) => {
    setSelectedRow(row);
    setEditFormData(row);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (row: any) => {
    setPreviewData(previewData.filter((item) => item.id !== row.id));
    showToast.success("Row deleted successfully");
  };

  const handleEditSubmit = () => {
    if (!selectedRow) return;

    setPreviewData(
      previewData.map((row) =>
        row.id === selectedRow.id ? { ...row, ...editFormData } : row
      )
    );
    setIsEditDialogOpen(false);
    setSelectedRow(null);
    setEditFormData({});
    showToast.success("Row updated successfully");
  };

  const handleFieldChange = (columnName: string, value: any) => {
    setEditFormData({ ...editFormData, [columnName]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{table.name} Preview</h3>
        <Button size="sm" onClick={handleAddRow}>
          <Plus className="h-4 w-4 mr-2" />
          Add Sample Row
        </Button>
      </div>
      <DataTable
        data={previewData}
        columns={columns}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Row</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {table.columns.map((column) => (
              <div key={column.name} className="space-y-2">
                <label className="text-sm font-medium">{column.name}</label>
                {column.type === "boolean" ? (
                  <Select
                    value={editFormData[column.name]?.toString()}
                    onValueChange={(value) =>
                      handleFieldChange(column.name, value === "true")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select value" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={editFormData[column.name] || ""}
                    onChange={(e) =>
                      handleFieldChange(column.name, e.target.value)
                    }
                    type={column.type === "number" ? "number" : "text"}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const generateSampleData = (columns: DatabaseTable["columns"]) => {
  const data: Record<string, any> = {};
  columns.forEach((col) => {
    switch (col.type) {
      case "string":
        data[col.name] = `Sample ${col.name}`;
        break;
      case "number":
        data[col.name] = Math.floor(Math.random() * 100);
        break;
      case "boolean":
        data[col.name] = Math.random() > 0.5;
        break;
      case "date":
        data[col.name] = new Date().toISOString();
        break;
      case "reference":
        data[col.name] = `REF-${Math.floor(Math.random() * 1000)}`;
        break;
      default:
        data[col.name] = "Sample data";
    }
  });
  return data;
};