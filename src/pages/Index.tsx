
import React, { useState, useRef } from "react";
import ImageDropzone from "@/components/ImageDropzone";
import Canvas from "@/components/Canvas";
import Toolbar from "@/components/Toolbar";
import { TextLabelProps } from "@/components/TextLabel";
import { exportImage } from "@/utils/exportImage";
import { toast } from "@/components/ui/sonner";
import { v4 as uuidv4 } from "@/utils/uuid";

const Index = () => {
  const [image, setImage] = useState<string | null>(null);
  const [labels, setLabels] = useState<TextLabelProps[]>([]);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result.toString());
        setLabels([]);
        setSelectedLabelId(null);
        toast.success("Image uploaded successfully");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddLabel = () => {
    if (!image) return;

    const canvasWidth = canvasRef.current?.clientWidth || 300;
    const canvasHeight = canvasRef.current?.clientHeight || 200;

    const newLabel: TextLabelProps = {
      id: uuidv4(),
      text: "New Text",
      x: canvasWidth / 2 - 50,
      y: canvasHeight / 2 - 25,
      fontSize: 24,
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#000000",
      backgroundColor: "",
      isSelected: true,
      onSelect: () => {},
      onChange: () => {},
      onDelete: () => {},
    };

    setLabels([...labels, newLabel]);
    setSelectedLabelId(newLabel.id);
    toast.success("New text label added");
  };

  const handleSelectLabel = (id: string | null) => {
    setSelectedLabelId(id);
  };

  const handleUpdateLabel = (id: string, updates: Partial<TextLabelProps>) => {
    setLabels(
      labels.map((label) => (label.id === id ? { ...label, ...updates } : label))
    );
  };

  const handleDeleteLabel = (id: string) => {
    setLabels(labels.filter((label) => label.id !== id));
    setSelectedLabelId(null);
  };

  const handleExport = async () => {
    if (!canvasRef.current) return;
    
    try {
      await exportImage(canvasRef, "png");
      toast.success("Image exported successfully");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed");
    }
  };

  const selectedLabel = labels.find((label) => label.id === selectedLabelId) || null;

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-bold text-center">🏷️ Smart Image Label Maker</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center">
          {!image ? (
            <div className="w-full max-w-xl">
              <ImageDropzone onImageUpload={handleImageUpload} />
            </div>
          ) : (
            <Canvas
              image={image}
              labels={labels}
              selectedLabelId={selectedLabelId}
              onSelectLabel={handleSelectLabel}
              onUpdateLabel={handleUpdateLabel}
              onDeleteLabel={handleDeleteLabel}
              canvasRef={canvasRef}
            />
          )}
        </div>

        <Toolbar
          hasImage={!!image}
          selectedLabel={selectedLabel}
          onLabelChange={handleUpdateLabel}
          onLabelDelete={handleDeleteLabel}
          onAddLabel={handleAddLabel}
          onExport={handleExport}
        />
      </div>
    </div>
  );
};

export default Index;
