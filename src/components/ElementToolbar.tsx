
import { Button } from "@/components/ui/button";
import { ElementType } from "@/types/scrapbook";
import { v4 as uuidv4 } from 'uuid';
import { Image, Type, Sticker, PencilLine, Music, Palette, Download, Save } from "lucide-react";
import { toast } from "sonner";

interface ElementToolbarProps {
  onAddElement: (elementType: ElementType) => void;
  onChangeBackground: (background: string) => void;
  onSave: () => void;
}

export const ElementToolbar = ({ onAddElement, onChangeBackground, onSave }: ElementToolbarProps) => {
  const handleAddText = () => {
    onAddElement(ElementType.TEXT);
    toast.success("Text element added");
  };

  const handleAddImage = () => {
    onAddElement(ElementType.IMAGE);
    toast.success("Image added");
  };

  const handleAddSticker = () => {
    onAddElement(ElementType.STICKER);
    toast.success("Sticker added");
  };

  const backgrounds = [
    { name: "Paper", value: "bg-scrapbook-page texture-paper" },
    { name: "Cream", value: "bg-scrapbook-cream" },
    { name: "Sage", value: "bg-scrapbook-sage" },
    { name: "Lavender", value: "bg-scrapbook-lavender" },
    { name: "Peach", value: "bg-scrapbook-peach" },
    { name: "Sky Blue", value: "bg-scrapbook-skyblue" },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 border rounded-lg bg-scrapbook-cream shadow-sm">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Add Elements</h3>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 flex-1" 
            onClick={handleAddText}
          >
            <Type className="h-4 w-4" />
            <span>Text</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 flex-1" 
            onClick={handleAddImage}
          >
            <Image className="h-4 w-4" />
            <span>Photo</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 flex-1" 
            onClick={handleAddSticker}
          >
            <Sticker className="h-4 w-4" />
            <span>Sticker</span>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 flex-1"
            disabled
          >
            <PencilLine className="h-4 w-4" />
            <span>Draw</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 flex-1"
            disabled
          >
            <Music className="h-4 w-4" />
            <span>Audio</span>
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Background</h3>
        <div className="grid grid-cols-3 gap-2">
          {backgrounds.map((bg) => (
            <div
              key={bg.value}
              className={`h-8 w-full rounded cursor-pointer border-2 ${bg.value === "bg-scrapbook-page texture-paper" ? "texture-paper" : bg.value}`}
              onClick={() => {
                onChangeBackground(bg.value);
                toast.success(`Background changed to ${bg.name}`);
              }}
            />
          ))}
        </div>
      </div>

      <div className="pt-4 border-t">
        <Button 
          className="w-full gap-2" 
          onClick={onSave}
        >
          <Save className="h-4 w-4" />
          <span>Save Page</span>
        </Button>
      </div>
    </div>
  );
};
