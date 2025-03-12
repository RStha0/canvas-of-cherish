
import { useState } from "react";
import { ScrapbookElement, TextElementData } from "@/types/scrapbook";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TextEditorProps {
  element: ScrapbookElement;
  onUpdate: (updatedElement: ScrapbookElement) => void;
}

export const TextEditor = ({ element, onUpdate }: TextEditorProps) => {
  const textData = element.data as TextElementData;
  const [text, setText] = useState(textData.content);
  const [fontSize, setFontSize] = useState(textData.fontSize?.toString() || "18");
  const [fontFamily, setFontFamily] = useState(textData.fontFamily || "Dancing Script, cursive");
  const [color, setColor] = useState(textData.color || "#444444");

  const handleSave = () => {
    const updatedElement = {
      ...element,
      data: {
        ...textData,
        content: text,
        fontSize: parseInt(fontSize),
        fontFamily,
        color
      }
    };
    onUpdate(updatedElement);
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="text-content">Text</Label>
        <Textarea
          id="text-content"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="font-size">Font Size</Label>
          <Input
            id="font-size"
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            min="10"
            max="72"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="text-color">Color</Label>
          <div className="flex gap-2">
            <Input
              id="text-color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="font-family">Font Style</Label>
        <Select value={fontFamily} onValueChange={setFontFamily}>
          <SelectTrigger id="font-family">
            <SelectValue placeholder="Select Font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Dancing Script, cursive">Handwritten</SelectItem>
            <SelectItem value="Pacifico, cursive">Fancy</SelectItem>
            <SelectItem value="Arial, sans-serif">Simple</SelectItem>
            <SelectItem value="Georgia, serif">Classic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4">
        <Button onClick={handleSave} className="w-full">Save Changes</Button>
      </div>
    </div>
  );
};
