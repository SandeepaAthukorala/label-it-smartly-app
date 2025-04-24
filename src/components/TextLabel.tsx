
import React, { useState, useRef, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

export interface TextLabelProps {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  color: string;
  backgroundColor: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onChange: (id: string, updates: Partial<TextLabelProps>) => void;
  onDelete: (id: string) => void;
}

const TextLabel: React.FC<TextLabelProps> = ({
  id,
  text,
  x,
  y,
  fontSize,
  fontWeight,
  fontStyle,
  color,
  backgroundColor,
  isSelected,
  onSelect,
  onChange,
  onDelete,
}) => {
  const [position, setPosition] = useState({ x, y });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setPosition({ x, y });
  }, [x, y]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    
    onSelect(id);
    setIsDragging(true);

    const rect = labelRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const parentRect = labelRef.current?.parentElement?.getBoundingClientRect();
      if (!parentRect) return;

      const newX = e.clientX - parentRect.left - dragOffset.x;
      const newY = e.clientY - parentRect.top - dragOffset.y;
      
      // Ensure label stays within canvas bounds
      const newPosition = {
        x: Math.max(0, Math.min(newX, parentRect.width - (labelRef.current?.offsetWidth || 0))),
        y: Math.max(0, Math.min(newY, parentRect.height - (labelRef.current?.offsetHeight || 0))),
      };
      
      setPosition(newPosition);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onChange(id, {
        x: position.x,
        y: position.y,
      });
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(id, { text: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
    } else if (e.key === "Delete" || e.key === "Backspace") {
      if (text.length === 0) {
        e.preventDefault();
        onDelete(id);
        toast("Text label deleted");
      }
    }
  };
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={labelRef}
      className={`text-label ${isSelected ? "selected" : ""} ${isEditing ? "editing" : ""}`}
      style={{
        left: position.x,
        top: position.y,
        fontSize: `${fontSize}px`,
        fontWeight: fontWeight as any,
        fontStyle: fontStyle,
        color: color,
        backgroundColor: backgroundColor || 'transparent',
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <textarea
          ref={inputRef}
          value={text}
          onChange={handleTextChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="bg-transparent outline-none border-none w-full resize-none"
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: fontWeight as any,
            fontStyle: fontStyle,
            color: color,
          }}
        />
      ) : (
        text || "Click to edit"
      )}
    </div>
  );
};

export default TextLabel;
