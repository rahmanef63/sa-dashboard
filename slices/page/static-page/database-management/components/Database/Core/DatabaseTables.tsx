import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { TableForm } from '../Forms/TableForm';
import { useTableOperations } from '../../../hooks/useTableOperations';
import { DatabaseTable, TableFormData } from '@/shared/types/table';
import { useToast } from '@/shared/components/ui/use-toast';
import { ViewDataTables } from './ViewDataTables';

interface DatabaseTablesProps {
  databaseName: string;
}

export function DatabaseTables({ databaseName }: DatabaseTablesProps) {
  const { toast } = useToast();
  const [isTableFormOpen, setIsTableFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<{
    table_name: string;
    table_schema: string;
    description?: string;
  } | null>(null);
  const [mounted, setMounted] = React.useState(false);
  
  const { 
    tables, 
    isLoading, 
    error, 
    createTable,
    deleteTable,
    fetchTables 
  } = useTableOperations(databaseName);

  React.useLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Tables</h3>
          <Button onClick={() => setIsTableFormOpen(true)}>
            Create Table
          </Button>
        </div>
        <div className="text-center py-8 text-gray-500">
          Loading tables...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Tables</h3>
          <Button onClick={() => setIsTableFormOpen(true)}>
            Create Table
          </Button>
        </div>
        <div className="text-center py-8 text-red-500">
          Error loading tables: {error}
        </div>
      </div>
    );
  }

  const handleCreateTable = async (formData: TableFormData) => {
    try {
      await createTable(formData);
      setIsTableFormOpen(false);
      toast({
        title: "Success",
        description: `Table ${formData.name} has been created successfully.`
      });
      await fetchTables();
    } catch (error) {
      console.error('Failed to create table:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create table",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTable = async (tableName: string) => {
    try {
      await deleteTable(tableName);
      toast({
        title: "Success",
        description: `Table ${tableName} has been deleted.`
      });
      await fetchTables();
    } catch (error) {
      console.error('Failed to delete table:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete table",
        variant: "destructive"
      });
    }
  };

  const handleViewData = (table: typeof tables[0]) => {
    setSelectedTable(table);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tables</h3>
        <Button onClick={() => setIsTableFormOpen(true)}>
          Create Table
        </Button>
      </div>

      {tables.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <div className="text-gray-500 mb-2">No tables found</div>
          <div className="text-sm text-gray-400">
            Click the "Create Table" button to create your first table
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {tables.map((table) => (
            <div key={table.table_name} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{table.table_name}</h4>
                  {table.description && (
                    <p className="text-sm text-gray-500">{table.description}</p>
                  )}
                  {table.total_size && (
                    <p className="text-xs text-gray-400">Size: {table.total_size}</p>
                  )}
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleViewData(table)}
                  >
                    View Data
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteTable(table.table_name)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isTableFormOpen} onOpenChange={setIsTableFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Table</DialogTitle>
          </DialogHeader>
          <TableForm
            onSubmit={handleCreateTable}
            onCancel={() => setIsTableFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ViewDataTables
        isOpen={isPreviewOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTable(null);
          }
          setIsPreviewOpen(open);
        }}
        selectedTable={selectedTable}
        databaseName={databaseName}
        onTableUpdate={fetchTables}
      />
    </div>
  );
}
