import { useState } from "react";
import { BaseTable } from "../Core/BaseTable";
import { transactionColumns } from "../../../constants/tableColumns";

export const TransactionsTable = () => {
  return (
    <div className="space-y-4">
      <BaseTable
        searchPlaceholder="Search transactions..."
        columns={transactionColumns}
      />
    </div>
  );
};