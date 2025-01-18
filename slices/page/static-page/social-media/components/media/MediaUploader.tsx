import React, { useState, useCallback } from 'react';
import { Upload, X, FileType, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from 'shared/components/ui/button';
import { ACCEPTED_FILE_TYPES, FILE_SIZE_LIMITS, UPLOAD_STATES } from '../../config/media/constants';
import { cn } from 'shared/lib/utils';

interface MediaUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: Array<keyof typeof ACCEPTED_FILE_TYPES>;
  maxFiles?: number;
}

export const MediaUploader = ({ 
  onFileSelect, 
  acceptedTypes = ['IMAGE'],
  maxFiles = 1 
}: MediaUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File) => {
    const acceptedMimeTypes = acceptedTypes.flatMap(type => ACCEPTED_FILE_TYPES[type]);
    
    if (!acceptedMimeTypes.includes(file.type)) {
      setError('File type not supported');
      return false;
    }

    const fileTypeKey = acceptedTypes.find(type => 
      ACCEPTED_FILE_TYPES[type].includes(file.type)
    );

    if (fileTypeKey && file.size > FILE_SIZE_LIMITS[fileTypeKey]) {
      setError(`File size exceeds ${FILE_SIZE_LIMITS[fileTypeKey] / (1024 * 1024)}MB limit`);
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (files.length + droppedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles = droppedFiles.filter(validateFile);
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      validFiles.forEach(file => onFileSelect(file));
    }
  }, [files, maxFiles, onFileSelect, acceptedTypes]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFiles = Array.from(e.target.files || []);
    
    if (files.length + selectedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles = selectedFiles.filter(validateFile);
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      validFiles.forEach(file => onFileSelect(file));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          dragActive ? "border-primary bg-accent/10" : "border-border",
          error && "border-destructive"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple={maxFiles > 1}
          onChange={handleFileInput}
          accept={acceptedTypes.flatMap(type => ACCEPTED_FILE_TYPES[type]).join(',')}
          className="hidden"
          id="file-upload"
        />
        
        <label 
          htmlFor="file-upload"
          className="flex flex-col items-center cursor-pointer"
        >
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-1">
            Drag & drop or click to upload
          </p>
          <p className="text-xs text-muted-foreground">
            Supports: {acceptedTypes.join(', ')} (Max {FILE_SIZE_LIMITS.IMAGE / (1024 * 1024)}MB)
          </p>
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {files.map((file, index) => (
            <div 
              key={`${file.name}-${index}`}
              className="relative group bg-accent/50 rounded-lg p-4 flex items-center gap-3"
            >
              {file.type.startsWith('image/') ? (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              ) : (
                <FileType className="h-8 w-8 text-muted-foreground" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)}MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};