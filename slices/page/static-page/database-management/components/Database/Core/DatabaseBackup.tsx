import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Switch } from "@/shared/components/ui/switch";
import { toast } from "sonner";

interface DatabaseBackupProps {
  databaseName: string;
}

export function DatabaseBackup({ databaseName }: DatabaseBackupProps) {
  const [loading, setLoading] = React.useState(false);
  const [includeData, setIncludeData] = React.useState(true);
  const [useCompression, setUseCompression] = React.useState(true);

  const handleBackup = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/database/${databaseName}/backup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: includeData ? "full" : "structure",
          compression: useCompression,
        }),
      });

      if (!response.ok) {
        throw new Error("Backup failed");
      }

      const data = await response.json();
      toast.success("Backup created successfully");
    } catch (error) {
      toast.error("Failed to create backup");
      console.error("Backup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Database Backup</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label>Include Data</label>
          <Switch
            checked={includeData}
            onCheckedChange={setIncludeData}
          />
        </div>
        <div className="flex items-center justify-between">
          <label>Use Compression</label>
          <Switch
            checked={useCompression}
            onCheckedChange={setUseCompression}
          />
        </div>
        <Button
          onClick={handleBackup}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Creating Backup..." : "Create Backup"}
        </Button>
      </div>
    </Card>
  );
}