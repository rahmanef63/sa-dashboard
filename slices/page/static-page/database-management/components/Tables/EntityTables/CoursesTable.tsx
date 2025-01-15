import { useState } from "react";
import { BaseTable } from "../Core/BaseTable";
import { courseColumns } from "../../../constants/tableColumns";

export const CoursesTable = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4">
      <BaseTable
        searchPlaceholder="Search courses..."
        columns={courseColumns}
      />
    </div>
  );
};