'use client';

import { DatabaseManager } from "@/slices/page/static-page/database-management/components/Database/Core/DatabaseManager";
import { DebugConsole } from "@/shared/components/DebugConsole";

export default function DatabaseManagerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <DatabaseManager />
      <DebugConsole />
    </div>
  );
}
