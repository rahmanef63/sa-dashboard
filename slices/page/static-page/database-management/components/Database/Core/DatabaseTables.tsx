import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { TableForm } from '../Forms/TableForm';
import { useTableOperations } from '../../../hooks/useTableOperations';
import { DatabaseTable, TableFormData } from '@/shared/types/table';
import { useToast } from '@/shared/components/ui/use-toast';
import { TablePreview } from '../Preview/TablePreview';
import { QueryEditor } from '@/slices/page/static-page/database-management/components/Query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/shared/components/ui/scroll-area';

interface DatabaseTablesProps {
  databaseName: string;
}

export function DatabaseTables({ databaseName }: DatabaseTablesProps) {
  const { toast } = useToast();
  const [isTableFormOpen, setIsTableFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<DatabaseTable | null>(null);
  const [mounted, setMounted] = React.useState(false);
  
  const { 
    tables, 
    isLoading, 
    error, 
    createTable,
    deleteTable,
    updateTable,
    refetchTables 
  } = useTableOperations(databaseName);

  React.useLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Return null during server-side rendering and initial client render
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
      // Log form data for debugging
      (window as any).debugConsole?.form('Creating table', formData);
      
      await createTable(formData);
      setIsTableFormOpen(false);
      toast({
        title: "Success",
        description: `Table ${formData.name} has been created successfully.`
      });
      await refetchTables();
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
      await refetchTables();
    } catch (error) {
      console.error('Failed to delete table:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete table",
        variant: "destructive"
      });
    }
  };

  const handleViewData = (table: DatabaseTable) => {
    try {
      console.log('Viewing table data:', table);
      if (!table) {
        toast({
          title: "Error",
          description: "No table selected",
          variant: "destructive"
        });
        return;
      }
      setSelectedTable(table);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('Error viewing table data:', error);
      toast({
        title: "Error",
        description: "Failed to view table data",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="tables">
        <TabsList>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="query">Query Editor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tables" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="query">
          <QueryEditor databaseName={databaseName} />
        </TabsContent>
      </Tabs>

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

      {selectedTable && (
        <Dialog open={isPreviewOpen} onOpenChange={(open) => {
          if (!open) {
            setSelectedTable(null);
          }
          setIsPreviewOpen(open);
        }}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                Table: {selectedTable.table_name}
              </DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="preview">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Preview Data</TabsTrigger>
                <TabsTrigger value="edit">Edit Structure</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="mt-4">
                <ScrollArea className="h-[80vh] w-[95vh] rounded-md border">
                  <TablePreview table={selectedTable} databaseName={databaseName} />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="edit" className="mt-4">
                <ScrollArea className="h-[80vh] w-full rounded-md border">
                  <TableForm
                    initialData={{
                      name: selectedTable.table_name,
                      schema: selectedTable.table_schema,
                      columns: selectedTable.columns,
                    constraints: selectedTable.constraints,
                    description: selectedTable.description,
                  }}
                  onSubmit={async (data) => {
                    try {
                      // TODO: Implement table update
                      await updateTable(selectedTable.table_name, data);
                      toast({
                        title: "Success",
                        description: `Table ${selectedTable.table_name} has been updated.`
                      });
                      setIsPreviewOpen(false);
                      await refetchTables();
                    } catch (error) {
                      console.error('Failed to update table:', error);
                      toast({
                        title: "Error",
                        description: error instanceof Error ? error.message : "Failed to update table",
                        variant: "destructive"
                      });
                    }
                  }}
                  onCancel={() => setIsPreviewOpen(false)}
                />
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
