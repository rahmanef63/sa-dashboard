"use client";

import { useState, useEffect } from "react";
import { Button } from "shared/components/ui/button";
import { Input } from "shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "shared/components/ui/select";
import { DatabaseTable } from "../../../types";
import { Plus, Trash2 } from "lucide-react";
import { showToast } from "shared/utils/toast";

const DATA_TYPES = ["string", "number", "boolean", "date", "reference"];

interface ColumnType {
  name: string;
  type: string;
  required: boolean;
  references?: {
    table: string;
    column: string;
  };
}

interface DatabaseTableFormProps {
  onSave: (table: DatabaseTable) => void;
  availableTables: string[];
  initialTable?: DatabaseTable;
}

export const DatabaseTableForm = ({
  onSave,
  availableTables,
  initialTable,
}: DatabaseTableFormProps) => {
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState<ColumnType[]>([]);

  useEffect(() => {
    if (initialTable) {
      setTableName(initialTable.name);
      setColumns(initialTable.columns);
    }
  }, [initialTable]);

  const handleAddColumn = () => {
    setColumns([...columns, { name: "", type: "string", required: false }]);
  };

  const handleRemoveColumn = (index: number) => {
    setColumns(columns.filter((_: ColumnType, i: number) => i !== index));
  };

  const handleColumnChange = (index: number, field: string, value: any) => {
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    setColumns(newColumns);
  };

  const handleSubmit = () => {
    if (!tableName) {
      showToast.error("Table name is required");
      return;
    }

    if (columns.length === 0) {
      showToast.error("At least one column is required");
      return;
    }

    const hasValidColumns = columns.every((col: ColumnType) => col.name && col.type);
    if (!hasValidColumns) {
      showToast.error("All columns must have a name and type");
      return;
    }

    onSave({
      id: initialTable?.id || `tbl-${Date.now()}`,
      name: tableName,
      columns,
    });

    if (!initialTable) {
      setTableName("");
      setColumns([]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium">Table Name</label>
        <Input
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="Enter table name"
          className="mt-1"
          disabled={!!initialTable}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Columns</h3>
          <Button onClick={handleAddColumn} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Column
          </Button>
        </div>

        {columns.map((column: ColumnType, index: number) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="flex-1">
              <Input
                value={column.name}
                onChange={(e) =>
                  handleColumnChange(index, "name", e.target.value)
                }
                placeholder="Column name"
              />
            </div>

            <div className="w-40">
              <Select
                value={column.type}
                onValueChange={(value) =>
                  handleColumnChange(index, "type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {DATA_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {column.type === "reference" && (
              <div className="w-40">
                <Select
                  value={column.references?.table}
                  onValueChange={(value) =>
                    handleColumnChange(index, "references", {
                      table: value,
                      column: "id",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTables.map((table) => (
                      <SelectItem key={table} value={table}>
                        {table}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="w-24">
              <Select
                value={column.required ? "yes" : "no"}
                onValueChange={(value) =>
                  handleColumnChange(index, "required", value === "yes")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Required?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Required</SelectItem>
                  <SelectItem value="no">Optional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveColumn(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {columns.length > 0 && (
        <Button onClick={handleSubmit} className="w-full">
          {initialTable ? "Update Table" : "Create Table"}
        </Button>
      )}
    </div>
  );
};
