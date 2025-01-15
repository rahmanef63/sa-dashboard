import { Input } from "shared/components/ui/input";
import { Button } from "shared/components/ui/button";
import { Search, Filter } from "lucide-react";

interface SearchAndFilterBarProps {
  onSearch: (value: string) => void;
  onFilter?: () => void;
  placeholder?: string;
}

export const SearchAndFilterBar = ({
  onSearch,
  onFilter,
  placeholder = "Search..."
}: SearchAndFilterBarProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      {onFilter && (
        <Button variant="outline" onClick={onFilter}>
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      )}
    </div>
  );
};