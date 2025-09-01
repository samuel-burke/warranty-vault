import { useState, useRef } from "react";
import { Document } from "./AssetDashboard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Upload, File, X, CheckCircle } from "lucide-react";

interface DocumentUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (document: Omit<Document, "id">) => void;
}

interface FileWithMetadata {
  file: File;
  name: string;
  type: Document["type"];
}

export function DocumentUpload({ open, onOpenChange, onUpload }: DocumentUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileWithMetadata[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentTypes: { value: Document["type"]; label: string }[] = [
    { value: "receipt", label: "Receipt" },
    { value: "warranty", label: "Warranty Document" },
    { value: "manual", label: "User Manual" },
    { value: "other", label: "Other" }
  ];

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: FileWithMetadata[] = Array.from(files).map(file => ({
      file,
      name: file.name.split('.').slice(0, -1).join('.') || file.name,
      type: "other"
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const updateFile = (index: number, field: keyof FileWithMetadata, value: string) => {
    setSelectedFiles(prev => 
      prev.map((file, i) => 
        i === index ? { ...file, [field]: value } : file
      )
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Process each file
    selectedFiles.forEach(fileWithMetadata => {
      const document: Omit<Document, "id"> = {
        name: fileWithMetadata.name,
        type: fileWithMetadata.type,
        uploadDate: new Date().toISOString().split('T')[0],
        fileUrl: `/documents/${fileWithMetadata.file.name}`,
        fileSize: formatFileSize(fileWithMetadata.file.size)
      };

      onUpload(document);
    });

    setIsUploading(false);
    setUploadComplete(true);

    // Auto close after showing success
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setIsUploading(false);
    setUploadComplete(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Area */}
          <div 
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">Drop files here or click to browse</h3>
            <p className="text-sm text-muted-foreground">
              Support for PDF, JPG, PNG, and other document formats
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Selected Files ({selectedFiles.length})</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {selectedFiles.map((fileWithMetadata, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <File className="h-8 w-8 text-muted-foreground mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`name-${index}`}>Document Name</Label>
                            <Input
                              id={`name-${index}`}
                              value={fileWithMetadata.name}
                              onChange={(e) => updateFile(index, "name", e.target.value)}
                              placeholder="Enter document name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`type-${index}`}>Document Type</Label>
                            <Select 
                              value={fileWithMetadata.type} 
                              onValueChange={(value: Document["type"]) => updateFile(index, "type", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {documentTypes.map(type => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-muted-foreground">
                            {fileWithMetadata.file.name} • {formatFileSize(fileWithMetadata.file.size)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Status */}
          {uploadComplete && (
            <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
              <CheckCircle className="h-5 w-5" />
              <span>Documents uploaded successfully!</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={selectedFiles.length === 0 || isUploading}
            >
              {isUploading ? "Uploading..." : `Upload ${selectedFiles.length} Document${selectedFiles.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}