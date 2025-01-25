import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Switch } from "@/shared/components/ui/switch";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog";

interface DatabaseBackupProps {
  databaseName: string;
}

export function DatabaseBackup({ databaseName }: DatabaseBackupProps) {
  const [loading, setLoading] = React.useState(false);
  const [includeData, setIncludeData] = React.useState(true);
  const [useCompression, setUseCompression] = React.useState(true);

  const handleBackup = async () => {
    const toastId = toast.loading("Preparing backup...");
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
        const error = await response.json();
        throw new Error(error.details || "Backup failed");
      }

      const data = await response.json();
      toast.success("Backup created successfully", {
        description: `File: ${data.file}`,
        duration: 5000,
        id: toastId
      });
    } catch (error: any) {
      toast.error("Failed to create backup", {
        description: error.message,
        duration: 5000,
        id: toastId
      });
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
          <div>
            <label className="font-medium">Include Data</label>
            <p className="text-sm text-gray-500">
              {includeData ? "Full backup with data" : "Structure only"}
            </p>
          </div>
          <Switch
            checked={includeData}
            onCheckedChange={setIncludeData}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium">Use Compression</label>
            <p className="text-sm text-gray-500">
              {useCompression ? "Compress backup file" : "No compression"}
            </p>
          </div>
          <Switch
            checked={useCompression}
            onCheckedChange={setUseCompression}
          />
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating Backup..." : "Create Backup"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Database Backup</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to create a {includeData ? "full" : "structure-only"} backup of database "{databaseName}"{useCompression ? " with compression" : ""}.
                {!includeData && " Note: This backup will not include any data, only the database structure."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleBackup}>
                Create Backup
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}