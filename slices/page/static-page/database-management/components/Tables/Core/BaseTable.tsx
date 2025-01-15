import { useState } from "react";
import DataTable from "shared/components/DataTable";
import { SearchAndFilterBar } from "shared/components/SearchAndFilterBar";

interface Column {
  key: string;
  header: string;
}

interface BaseTableProps {
  searchPlaceholder: string;
  columns: Column[];
  data?: any[];
  onSearch?: (query: string) => void;
}

export const BaseTable = ({
  searchPlaceholder,
  columns,
  data = [],
  onSearch,
}: BaseTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <div className="space-y-4">
      <SearchAndFilterBar
        onSearch={handleSearch}
        placeholder={searchPlaceholder}
      />
      <DataTable
        data={data}
        columns={columns}
      />
    </div>
  );
};
