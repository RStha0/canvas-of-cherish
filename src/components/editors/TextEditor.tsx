
import { useState, useRef } from "react";
import { ScrapbookElement, TextElementData } from "@/types/scrapbook";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Type, PaintBucket } from "lucide-react";
import { toast } from "sonner";

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
  const [backgroundColor, setBackgroundColor] = useState(textData.backgroundColor || "transparent");
  const [textAlign, setTextAlign] = useState(textData.textAlign || "left");
  const [fontWeight, setFontWeight] = useState(textData.fontWeight || "normal");
  const [fontStyle, setFontStyle] = useState(textData.fontStyle || "normal");
  
  const previewRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    const updatedElement = {
      ...element,
      data: {
        ...textData,
        content: text,
        fontSize: parseInt(fontSize),
        fontFamily,
        color,
        backgroundColor,
        textAlign,
        fontWeight,
        fontStyle
      }
    };
    onUpdate(updatedElement);
    toast.success("Text updated");
  };

  const handleTextAlignChange = (value: string) => {
    if (value) {
      setTextAlign(value as "left" | "center" | "right");
    }
  };

  const toggleBold = () => {
    setFontWeight(fontWeight === "bold" ? "normal" : "bold");
  };

  const toggleItalic = () => {
    setFontStyle(fontStyle === "italic" ? "normal" : "italic");
  };

  const fontOptions = [
    { label: "Handwritten", value: "Dancing Script, cursive" },
    { label: "Fancy", value: "Pacifico, cursive" },
    { label: "Simple", value: "Arial, sans-serif" },
    { label: "Classic", value: "Georgia, serif" },
    { label: "Playful", value: "Comic Sans MS, cursive" },
    { label: "Elegant", value: "Playfair Display, serif" }
  ];

  const colorPresets = [
    "#444444", "#000000", "#ffffff", 
    "#e53935", "#43a047", "#1e88e5",
    "#f9a825", "#8e24aa", "#f06292",
    "#26a69a", "#ff7043", "#78909c"
  ];

  return (
    <div className="space-y-4 pt-2">
      {/* Preview */}
      <div className="bg-neutral-900/5 p-4 rounded-lg mb-4">
        <div 
          ref={previewRef}
          className="min-h-[100px] p-4 flex items-center justify-center rounded bg-white/50"
        >
          <div
            style={{
              fontFamily,
              fontSize: `${fontSize}px`,
              color,
              backgroundColor,
              textAlign: textAlign as any,
              fontWeight,
              fontStyle,
              padding: '8px',
              width: '100%',
              wordBreak: 'break-word'
            }}
          >
            {text || "Preview text"}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="text-content">Text</Label>
        <Textarea
          id="text-content"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full"
          placeholder="Enter your text here"
        />
      </div>

      {/* Text formatting toolbar - Instagram style */}
      <div className="flex flex-wrap gap-2 py-2 border-y">
        <ToggleGroup type="single" value={textAlign} onValueChange={handleTextAlignChange}>
          <ToggleGroupItem value="left" aria-label="Align left">
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <AlignRight className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <Button 
          variant="ghost" 
          size="icon"
          className={`h-8 w-8 ${fontWeight === 'bold' ? 'bg-secondary' : ''}`}
          onClick={toggleBold}
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className={`h-8 w-8 ${fontStyle === 'italic' ? 'bg-secondary' : ''}`}
          onClick={toggleItalic}
        >
          <Italic className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4" />
          <Label htmlFor="font-size">Font Size</Label>
        </div>
        <Slider
          id="font-size"
          min={10}
          max={72}
          step={1}
          value={[parseInt(fontSize)]}
          onValueChange={(values) => setFontSize(values[0].toString())}
          className="py-2"
        />
        <div className="text-xs text-right text-muted-foreground">{fontSize}px</div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <PaintBucket className="h-4 w-4" />
          <Label>Text Color</Label>
        </div>
        <div className="grid grid-cols-6 gap-2 mb-2">
          {colorPresets.map((presetColor) => (
            <Button
              key={presetColor}
              type="button"
              variant="outline"
              className="w-full p-0 h-8 rounded-md overflow-hidden"
              style={{ 
                backgroundColor: presetColor,
                border: color === presetColor ? '2px solid black' : '1px solid #0001'
              }}
              onClick={() => setColor(presetColor)}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <Input
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="background-color">Background</Label>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setBackgroundColor("transparent")}
              className="text-xs h-7"
            >
              Clear
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Input
            id="background-color"
            type="color"
            value={backgroundColor === "transparent" ? "#ffffff" : backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-12 h-10 p-1"
            disabled={backgroundColor === "transparent"}
          />
          <Input
            type="text"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="flex-1"
            placeholder="transparent"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="font-family">Font Style</Label>
        <Select value={fontFamily} onValueChange={setFontFamily}>
          <SelectTrigger id="font-family">
            <SelectValue placeholder="Select Font" />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map(option => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                style={{ fontFamily: option.value }}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4">
        <Button onClick={handleSave} className="w-full">Save Changes</Button>
      </div>
    </div>
  );
};
