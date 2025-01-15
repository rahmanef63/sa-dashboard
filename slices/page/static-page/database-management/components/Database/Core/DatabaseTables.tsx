"use client";

import { useState } from "react";
import { DatabaseTable } from "shared/types/global";
import { DatabaseTableForm } from "../Forms/DatabaseTableForm";
import { Card } from "shared/components/ui/card";
import { Table, Plus, Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "shared/components/ui/button";
import { FormDialog } from "shared/components/FormDialog";
import { ConfirmDialog } from "shared/components/ConfirmDialog";
import { showToast } from "shared/utils/toast";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "shared/components/ui/collapsible";
import DataTable from "shared/components/DataTable";
import { databaseTableColumns } from "../../../constants/tableColumns";
import { TablePreview } from "../Preview/TablePreview";

interface DatabaseTablesProps {
  tables: DatabaseTable[];
  onAddTable: (table: DatabaseTable) => void;
  onUpdateTable: (table: DatabaseTable) => void;
  onDeleteTable: (tableName: string) => void;
  availableTables: string[];
}

export const DatabaseTables = ({
  tables,
  onAddTable,
  onUpdateTable,
  onDeleteTable,
  availableTables,
}: DatabaseTablesProps) => {
  const [isEditTableDialogOpen, setIsEditTableDialogOpen] = useState(false);
  const [isDeleteTableDialogOpen, setIsDeleteTableDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<DatabaseTable | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const handleEditClick = (table: DatabaseTable) => {
    setSelectedTable(table);
    setIsEditTableDialogOpen(true);
  };

  const handleDeleteClick = (table: DatabaseTable) => {
    setSelectedTable(table);
    setIsDeleteTableDialogOpen(true);
  };

  const handleUpdateTable = (updatedTable: DatabaseTable) => {
    if (!selectedTable) return;
    onUpdateTable(updatedTable);
    setIsEditTableDialogOpen(false);
    setSelectedTable(null);
    showToast.success("Table updated successfully");
  };

  const handleDeleteTable = () => {
    if (!selectedTable) return;
    onDeleteTable(selectedTable.name);
    setIsDeleteTableDialogOpen(false);
    setSelectedTable(null);
    showToast.success("Table deleted successfully");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Create New Table</h2>
        <DatabaseTableForm
          onSave={onAddTable}
          availableTables={availableTables}
        />
      </Card>

      {tables.length > 0 ? (
        <Card className="p-6">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Table className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Existing Tables</h2>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <DataTable
                data={tables}
                columns={databaseTableColumns}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="text-center space-y-2">
            <Table className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-medium">No Tables</h3>
            <p className="text-muted-foreground">
              Create your first table to get started
            </p>
          </div>
        </Card>
      )}

      {selectedTable && (
        <>
          <FormDialog
            isOpen={isEditTableDialogOpen}
            onClose={() => {
              setIsEditTableDialogOpen(false);
              setSelectedTable(null);
            }}
            onSubmit={() => {}}
            title="Edit Table"
            description="Update the table structure."
            previewComponent={<TablePreview table={selectedTable} />}
          >
            <DatabaseTableForm
              onSave={handleUpdateTable}
              availableTables={availableTables}
              initialTable={selectedTable}
            />
          </FormDialog>

          <ConfirmDialog
            isOpen={isDeleteTableDialogOpen}
            onClose={() => {
              setIsDeleteTableDialogOpen(false);
              setSelectedTable(null);
            }}
            onConfirm={handleDeleteTable}
            title="Delete Table"
            description={`Are you sure you want to delete the table "${selectedTable.name}"? This action cannot be undone.`}
          />
        </>
      )}
    </div>
  );
};
