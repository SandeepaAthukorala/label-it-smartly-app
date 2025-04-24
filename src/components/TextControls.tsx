
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Bold,
  Italic,
  Delete,
  Text,
} from "lucide-react";
import { TextLabelProps } from "./TextLabel";

interface TextControlsProps {
  selectedLabel: TextLabelProps | null;
  onChange: (id: string, updates: Partial<TextLabelProps>) => void;
  onDelete: (id: string) => void;
  onAddLabel: () => void;
}

const TextControls: React.FC<TextControlsProps> = ({
  selectedLabel,
  onChange,
  onDelete,
  onAddLabel,
}) => {
  const handleFontSizeChange = (value: number[]) => {
    if (selectedLabel) {
      onChange(selectedLabel.id, { fontSize: value[0] });
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedLabel) {
      onChange(selectedLabel.id, { color: e.target.value });
    }
  };

  const handleBackgroundColorChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (selectedLabel) {
      onChange(selectedLabel.id, { backgroundColor: e.target.value });
    }
  };

  const toggleBold = () => {
    if (selectedLabel) {
      const newWeight = selectedLabel.fontWeight === "bold" ? "normal" : "bold";
      onChange(selectedLabel.id, { fontWeight: newWeight });
    }
  };

  const toggleItalic = () => {
    if (selectedLabel) {
      const newStyle = selectedLabel.fontStyle === "italic" ? "normal" : "italic";
      onChange(selectedLabel.id, { fontStyle: newStyle });
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Text Controls</h3>
        <Button onClick={onAddLabel} variant="outline" className="ml-auto">
          <Text className="h-4 w-4 mr-2" />
          Add Text
        </Button>
      </div>

      {selectedLabel ? (
        <>
          <div className="mb-4">
            <Label htmlFor="fontSize" className="block mb-2">
              Font Size: {selectedLabel.fontSize}px
            </Label>
            <Slider
              id="fontSize"
              value={[selectedLabel.fontSize]}
              min={10}
              max={72}
              step={1}
              onValueChange={handleFontSizeChange}
              className="mb-4"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button
              variant={selectedLabel.fontWeight === "bold" ? "default" : "outline"}
              size="sm"
              onClick={toggleBold}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={selectedLabel.fontStyle === "italic" ? "default" : "outline"}
              size="sm"
              onClick={toggleItalic}
            >
              <Italic className="h-4 w-4" />
            </Button>
          </div>

          <div className="mb-4">
            <Label htmlFor="textColor" className="block mb-2">
              Text Color
            </Label>
            <div className="flex items-center">
              <div
                className="w-6 h-6 rounded-full mr-2 border border-gray-300"
                style={{ backgroundColor: selectedLabel.color }}
              ></div>
              <Input
                id="textColor"
                type="color"
                value={selectedLabel.color}
                onChange={handleColorChange}
                className="w-full h-8"
              />
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="bgColor" className="block mb-2">
              Background Color
            </Label>
            <div className="flex items-center">
              <div
                className="w-6 h-6 rounded-full mr-2 border border-gray-300"
                style={{ backgroundColor: selectedLabel.backgroundColor || 'transparent' }}
              ></div>
              <Input
                id="bgColor"
                type="color"
                value={selectedLabel.backgroundColor || '#ffffff'}
                onChange={handleBackgroundColorChange}
                className="w-full h-8"
              />
            </div>
          </div>

          <Button
            variant="destructive"
            onClick={() => onDelete(selectedLabel.id)}
            className="w-full"
          >
            <Delete className="h-4 w-4 mr-2" />
            Delete Label
          </Button>
        </>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <Text className="h-12 w-12 mx-auto mb-2 opacity-30" />
          <p>Add text or select an existing label</p>
        </div>
      )}
    </div>
  );
};

export default TextControls;
