
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface ImageDropzoneProps {
  onImageUpload: (file: File) => void;
}

const ImageDropzone = ({ onImageUpload }: ImageDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        handleFile(file);
      }
    },
    [onImageUpload]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        handleFile(file);
      }
    },
    [onImageUpload]
  );

  const handleFile = (file: File) => {
    if (file.type.match('image.*')) {
      onImageUpload(file);
    } else {
      toast.error("Please select an image file");
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
        isDragging ? "bg-blue-50 border-blue-400" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium mb-2">Drag & drop your image here</h3>
      <p className="text-sm text-gray-500 mb-4">
        or click to browse from your computer
      </p>
      <Button asChild>
        <label className="cursor-pointer">
          Choose Image
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileInput}
          />
        </label>
      </Button>
    </div>
  );
};

export default ImageDropzone;
