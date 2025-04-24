
import React, { useRef, useEffect, useState } from "react";
import TextLabel, { TextLabelProps } from "./TextLabel";
import { fabric } from "fabric";

interface CanvasProps {
  image: string | null;
  labels: TextLabelProps[];
  selectedLabelId: string | null;
  onSelectLabel: (id: string | null) => void;
  onUpdateLabel: (id: string, updates: Partial<TextLabelProps>) => void;
  onDeleteLabel: (id: string) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const Canvas: React.FC<CanvasProps> = ({
  image,
  labels,
  selectedLabelId,
  onSelectLabel,
  onUpdateLabel,
  onDeleteLabel,
  canvasRef,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (image && imgRef.current) {
      const img = new Image();
      img.onload = () => {
        // Set canvas dimensions based on image size with maximum width/height
        const maxWidth = window.innerWidth * 0.7;  // 70% of viewport width
        const maxHeight = window.innerHeight * 0.7;  // 70% of viewport height
        
        const aspectRatio = img.width / img.height;
        
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        }
        
        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }
        
        setDimensions({ width, height });
      };
      img.src = image;
    }
  }, [image]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    // If clicking the background (not a label), deselect
    if (e.target === canvasRef.current || e.target === imgRef.current) {
      onSelectLabel(null);
    }
  };

  return (
    <div
      ref={canvasRef}
      className="canvas-container relative mx-auto"
      style={{ width: dimensions.width, height: dimensions.height }}
      onClick={handleCanvasClick}
    >
      {image && (
        <img
          ref={imgRef}
          src={image}
          alt="Canvas"
          className="w-full h-full object-contain"
        />
      )}
      {image &&
        labels.map((label) => (
          <TextLabel
            key={label.id}
            {...label}
            isSelected={selectedLabelId === label.id}
            onSelect={onSelectLabel}
            onChange={onUpdateLabel}
            onDelete={onDeleteLabel}
          />
        ))}
    </div>
  );
};

export default Canvas;
