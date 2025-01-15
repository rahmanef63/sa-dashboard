import { Database as DatabaseIcon } from "lucide-react";
import { Card } from "shared/components/ui/card";

interface DatabaseEmptyStateProps {
  onCreateClick: () => void;
}

export const DatabaseEmptyState = ({ onCreateClick }: DatabaseEmptyStateProps) => {
  return (
    <Card className="p-6">
      <div className="text-center space-y-2">
        <DatabaseIcon className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="text-lg font-medium">No Databases</h3>
        <p className="text-muted-foreground">
          Create your first database to get started
        </p>
      </div>
    </Card>
  );
};