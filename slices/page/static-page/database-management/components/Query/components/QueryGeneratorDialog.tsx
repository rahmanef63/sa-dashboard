import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { fetchTableColumns, fetchTables } from '../api/database';

interface QueryGeneratorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onQueryGenerated: (query: string) => void;
  databaseName: string;
}

export function QueryGeneratorDialog({
  isOpen,
  onClose,
  onQueryGenerated,
  databaseName
}: QueryGeneratorDialogProps) {
  const [tables, setTables] = useState<string[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTables();
    }
  }, [isOpen, databaseName]);

  useEffect(() => {
    if (selectedTable) {
      loadColumns();
    }
  }, [selectedTable]);

  const loadTables = async () => {
    try {
      setLoading(true);
      const data = await fetchTables(databaseName);
      setTables(data);
    } catch (error) {
      console.error('Error loading tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadColumns = async () => {
    try {
      setLoading(true);
      const data = await fetchTableColumns(databaseName, selectedTable);
      setColumns(data);
    } catch (error) {
      console.error('Error loading columns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (value: string) => {
    setSelectedTable(value);
    setSelectedColumns([]);
  };

  const handleColumnChange = (value: string) => {
    setSelectedColumns(prev => {
      if (prev.includes(value)) {
        return prev.filter(col => col !== value);
      }
      return [...prev, value];
    });
  };

  const generateQuery = () => {
    const columnsString = selectedColumns.length > 0 
      ? selectedColumns.join(', ')
      : '*';
    
    const query = `SELECT ${columnsString}\nFROM ${selectedTable};`;
    onQueryGenerated(query);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Query</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Table</label>
            <Select
              value={selectedTable}
              onValueChange={handleTableChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a table" />
              </SelectTrigger>
              <SelectContent>
                {tables.map((table) => (
                  <SelectItem key={table} value={table}>
                    {table}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTable && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Columns</label>
              <div className="grid grid-cols-2 gap-2">
                {columns.map((column) => (
                  <Button
                    key={column}
                    variant={selectedColumns.includes(column) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleColumnChange(column)}
                    className="justify-start"
                  >
                    {column}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={generateQuery} disabled={!selectedTable}>
            Generate Query
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
