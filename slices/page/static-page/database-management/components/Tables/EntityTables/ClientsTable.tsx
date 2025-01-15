import { BaseTable } from "../Core/BaseTable";
import { clientColumns } from "../../../constants/tableColumns";

export const ClientsTable = () => {
  return (
    <div className="space-y-4">
      <BaseTable
        searchPlaceholder="Search clients..."
        columns={clientColumns}
      />
    </div>
  );
};