import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog";
import { Progress } from "@/shared/components/ui/progress";

interface DatabaseRestoreProps {
  databaseName: string;
}

export function DatabaseRestore({ databaseName }: DatabaseRestoreProps) {
  const [loading, setLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 1GB)
      const maxSize = 1024 * 1024 * 1024; // 1GB in bytes
      if (file.size > maxSize) {
        toast.error("File too large", {
          description: "Maximum file size is 1GB",
          duration: 5000
        });
        event.target.value = '';
        return;
      }

      // Validate file extension
      if (!file.name.endsWith('.sql') && !file.name.endsWith('.sql.gz')) {
        toast.error("Invalid file format", {
          description: "Please select a .sql or .sql.gz file",
          duration: 5000
        });
        event.target.value = '';
        return;
      }

      setSelectedFile(file);
      toast.success("File selected", {
        description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
        duration: 3000
      });
    }
  };

  const handleRestore = async () => {
    if (!selectedFile) {
      toast.error("No file selected", {
        description: "Please select a backup file to restore",
        duration: 5000
      });
      return;
    }

    const toastId = toast.loading("Starting database restore...");
    try {
      setLoading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const xhr = new XMLHttpRequest();
      const promise = new Promise((resolve, reject) => {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(progress);
            toast.loading(`Uploading: ${progress}%`, { id: toastId });
          }
        });

        xhr.addEventListener("load", () => resolve(xhr.response));
        xhr.addEventListener("error", () => reject(new Error("Upload failed")));
        xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

        xhr.open("POST", `/api/database/${databaseName}/restore`);
        xhr.send(formData);
      });

      await promise;
      
      if (xhr.status !== 200) {
        const error = JSON.parse(xhr.responseText);
        throw new Error(error.details || "Failed to restore database");
      }

      toast.success("Database restored successfully", {
        description: "The database has been restored from the backup file",
        duration: 5000,
        id: toastId
      });

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      toast.error("Restore failed", {
        description: error.message,
        duration: 5000,
        id: toastId
      });
      console.error("Restore error:", error);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Database Restore</h3>
      <div className="space-y-4">
        <div>
          <input
            type="file"
            accept=".sql,.sql.gz"
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={loading}
            className="w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="mt-1 text-sm text-gray-500">
            Supported formats: .sql, .sql.gz (Max size: 1GB)
          </p>
        </div>

        {loading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-center text-gray-500">
              Uploading: {uploadProgress}%
            </p>
          </div>
        )}

        {selectedFile && !loading && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full">
                Restore Database
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>⚠️ Warning: Database Restore</AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p className="font-medium text-red-600">
                    This action will completely replace the current database "{databaseName}"!
                  </p>
                  <p>
                    • All existing data will be lost
                    <br />
                    • The database will be restored from: {selectedFile.name}
                    <br />
                    • This process cannot be undone
                  </p>
                  <p className="mt-4">
                    Are you absolutely sure you want to proceed?
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleRestore}
                >
                  Yes, Restore Database
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </Card>
  );
}
