
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Save, Image } from "lucide-react";
import TextControls from "./TextControls";
import { TextLabelProps } from "./TextLabel";
import { toast } from "@/components/ui/sonner";

interface ToolbarProps {
  hasImage: boolean;
  selectedLabel: TextLabelProps | null;
  onLabelChange: (id: string, updates: Partial<TextLabelProps>) => void;
  onLabelDelete: (id: string) => void;
  onAddLabel: () => void;
  onExport: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  hasImage,
  selectedLabel,
  onLabelChange,
  onLabelDelete,
  onAddLabel,
  onExport,
}) => {
  return (
    <div className="bg-white border-l border-gray-200 w-64 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Image Labeler</h2>
      </div>

      {hasImage ? (
        <>
          <div className="flex-grow overflow-y-auto">
            <TextControls
              selectedLabel={selectedLabel}
              onChange={onLabelChange}
              onDelete={onLabelDelete}
              onAddLabel={onAddLabel}
            />
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <Button 
              className="w-full" 
              onClick={onExport}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Image
            </Button>
          </div>
        </>
      ) : (
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center text-gray-500">
            <Image className="mx-auto h-12 w-12 opacity-30 mb-2" />
            <p>Upload an image to start labeling</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
