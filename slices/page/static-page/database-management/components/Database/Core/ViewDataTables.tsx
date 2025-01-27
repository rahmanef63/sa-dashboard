import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { TableForm } from '../Forms/TableForm';
import { DatabaseTable } from '@/shared/types/table';
import { useToast } from '@/shared/components/ui/use-toast';
import { TablePreview } from '../Preview/TablePreview';
import { ScrollArea, ScrollBar } from '@/shared/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useTableOperations } from '../../../hooks/useTableOperations';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

interface ViewDataTablesProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTable: { table_name: string; table_schema: string; description?: string; } | null;
  databaseName: string;
  onTableUpdate?: () => void;
}

export function ViewDataTables({ 
  isOpen, 
  onOpenChange, 
  selectedTable, 
  databaseName,
  onTableUpdate 
}: ViewDataTablesProps) {
  const { toast } = useToast();
  const { updateTable, fetchTableDetails } = useTableOperations(databaseName);
  const [tableDetails, setTableDetails] = useState<DatabaseTable | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const previousTableRef = useRef<string | null>(null);

  useEffect(() => {
    async function loadTableDetails() {
      if (isOpen && selectedTable) {
        // Skip if we're already showing details for this table
        if (previousTableRef.current === selectedTable.table_name && tableDetails) {
          return;
        }

        setIsLoading(true);
        try {
          const details = await fetchTableDetails(selectedTable.table_name);
          if (details) {
            setTableDetails(details);
            previousTableRef.current = selectedTable.table_name;
          } else {
            toast({
              title: "Error",
              description: "Failed to load table details",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Error loading table details:', error);
          toast({
            title: "Error",
            description: "Failed to load table details",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    }

    loadTableDetails();
  }, [isOpen, selectedTable, fetchTableDetails, toast, tableDetails]);

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      // Don't clear the details immediately to avoid flashing when reopening the same table
      previousTableRef.current = null;
    }
  };

  if (!selectedTable) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Table: {selectedTable.table_name}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner />
          </div>
        ) : tableDetails ? (
          <Tabs defaultValue="preview">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Preview Data</TabsTrigger>
              <TabsTrigger value="edit">Edit Structure</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-4">
              <ScrollArea className="h-[80vh] w-[95vh] rounded-md border">
                <TablePreview table={tableDetails} databaseName={databaseName} />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="edit" className="mt-4">
              <ScrollArea className="h-[80vh] w-full rounded-md border">
                <TableForm
                  initialData={{
                    name: tableDetails.table_name,
                    schema: tableDetails.table_schema,
                    columns: tableDetails.columns,
                    constraints: tableDetails.constraints,
                    description: tableDetails.description,
                  }}
                  onSubmit={async (data) => {
                    try {
                      await updateTable(tableDetails.table_name, data);
                      toast({
                        title: "Success",
                        description: `Table ${tableDetails.table_name} has been updated.`
                      });
                      onOpenChange(false);
                      onTableUpdate?.();
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: error instanceof Error ? error.message : "Failed to update table",
                        variant: "destructive"
                      });
                    }
                  }}
                  onCancel={() => onOpenChange(false)}
                />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex items-center justify-center p-8">
            <p>No table details available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
