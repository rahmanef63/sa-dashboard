import { BaseTable } from "../Core/BaseTable";

export const EmployeesTable = () => {
  const columns = [
    { key: "name", header: "Name" },
    { key: "position", header: "Position" },
    { key: "department", header: "Department" },
    { key: "email", header: "Email" }
  ];

  return (
    <div className="space-y-4">
      <BaseTable
        searchPlaceholder="Search employees..."
        columns={columns}
      />
    </div>
  );
};