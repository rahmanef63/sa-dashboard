import { Button } from "shared/components/ui/button";
import { Card } from "shared/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import { DatabaseTables } from "./DatabaseTables";
import { Database, DatabaseTable } from "shared/types/global";

interface DatabaseContentProps {
  database: Database;
  onEditClick: (db: Database) => void;
  onDeleteClick: (db: Database) => void;
  onAddTable: (table: DatabaseTable) => void;
  onUpdateTable: (table: DatabaseTable) => void;
  onDeleteTable: (tableId: string) => void;
  availableTables: string[];
}

export const DatabaseContent = ({
  database,
  onEditClick,
  onDeleteClick,
  onAddTable,
  onUpdateTable,
  onDeleteTable,
  availableTables,
}: DatabaseContentProps) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">{database.name}</h2>
          {database.description && (
            <p className="text-muted-foreground">{database.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditClick(database)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteClick(database)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <DatabaseTables
          tables={database.tables}
          onAddTable={onAddTable}
          onUpdateTable={onUpdateTable}
          onDeleteTable={onDeleteTable}
          availableTables={availableTables}
        />
      </div>
    </Card>
  );
};