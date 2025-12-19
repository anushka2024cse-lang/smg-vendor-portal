import { useState, useRef } from "react";
import { Upload, File, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  title: string;
  description?: string;
  acceptedTypes: string[];
  maxSize?: number;
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  uploadedFile?: { name: string; size: string } | null;
  isUploading?: boolean;
  uploadProgress?: number;
}

export function FileUpload({
  title,
  description,
  acceptedTypes,
  maxSize = 10,
  onFileSelect,
  onFileRemove,
  uploadedFile,
  isUploading = false,
  uploadProgress = 0,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatFileTypes = () => {
    return acceptedTypes.map((type) => {
      if (type.includes("pdf")) return "PDF";
      if (type.includes("image")) return "JPG, PNG";
      return type.toUpperCase();
    }).join(", ");
  };

  const validateFile = (file: File): boolean => {
    setError(null);

    const isValidType = acceptedTypes.some((type) => {
      if (type === "application/pdf") return file.type === "application/pdf";
      if (type.startsWith("image/")) return file.type.startsWith("image/");
      return false;
    });

    if (!isValidType) {
      setError(`Invalid file type. Accepted: ${formatFileTypes()}`);
      return false;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return false;
    }

    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (uploadedFile) {
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10">
              <File className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{uploadedFile.name}</p>
              <p className="text-xs text-muted-foreground">{uploadedFile.size}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Check className="w-3 h-3" />
              Uploaded
            </Badge>
            {onFileRemove && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onFileRemove}
                data-testid={`button-remove-${title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-foreground">{title}</h4>
      
      <div
        className={`relative min-h-[160px] rounded-lg border-2 border-dashed transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : error
            ? "border-destructive bg-destructive/5"
            : "border-border"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        data-testid={`dropzone-${title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          onChange={handleFileChange}
          className="hidden"
          data-testid={`input-file-${title.toLowerCase().replace(/\s+/g, "-")}`}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 cursor-pointer">
          {isUploading ? (
            <div className="w-full max-w-xs space-y-3">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-full bg-muted mb-3">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                {isDragging ? "Drop file here" : "Click to upload or drag and drop"}
              </p>
              {description && (
                <p className="text-xs text-muted-foreground mb-3">{description}</p>
              )}
              <div className="flex flex-wrap gap-2 justify-center">
                {acceptedTypes.map((type) => (
                  <Badge key={type} variant="outline" className="text-xs">
                    {type.includes("pdf") ? "PDF" : type.includes("image") ? "JPG/PNG" : type}
                  </Badge>
                ))}
                <Badge variant="outline" className="text-xs">
                  Max {maxSize}MB
                </Badge>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-4 h-4" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
