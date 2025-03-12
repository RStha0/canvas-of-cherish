
import { useState } from "react";
import { ScrapbookElement, StickerElementData } from "@/types/scrapbook";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface StickerSelectorProps {
  element: ScrapbookElement;
  onUpdate: (updatedElement: ScrapbookElement) => void;
}

// Sticker collections
const STICKERS = {
  favorites: [
    "https://cdn-icons-png.flaticon.com/512/6010/6010051.png",
    "https://cdn-icons-png.flaticon.com/512/742/742751.png",
    "https://cdn-icons-png.flaticon.com/512/1791/1791330.png",
    "https://cdn-icons-png.flaticon.com/512/1791/1791337.png",
  ],
  emoji: [
    "https://cdn-icons-png.flaticon.com/512/166/166538.png", // 😁
    "https://cdn-icons-png.flaticon.com/512/166/166527.png", // 😍
    "https://cdn-icons-png.flaticon.com/512/166/166525.png", // 😎
    "https://cdn-icons-png.flaticon.com/512/166/166549.png", // 😢
    "https://cdn-icons-png.flaticon.com/512/166/166537.png", // 😮
    "https://cdn-icons-png.flaticon.com/512/166/166539.png", // 😂
  ],
  nature: [
    "https://cdn-icons-png.flaticon.com/512/616/616520.png", // flower
    "https://cdn-icons-png.flaticon.com/512/616/616543.png", // sun
    "https://cdn-icons-png.flaticon.com/512/616/616516.png", // leaf
    "https://cdn-icons-png.flaticon.com/512/616/616558.png", // moon
    "https://cdn-icons-png.flaticon.com/512/616/616500.png", // rainbow
    "https://cdn-icons-png.flaticon.com/512/1585/1585003.png", // tree
  ],
  food: [
    "https://cdn-icons-png.flaticon.com/512/2553/2553691.png", // pizza
    "https://cdn-icons-png.flaticon.com/512/2553/2553691.png", // ice cream
    "https://cdn-icons-png.flaticon.com/512/1046/1046751.png", // cake
    "https://cdn-icons-png.flaticon.com/512/1147/1147805.png", // coffee
    "https://cdn-icons-png.flaticon.com/512/1996/1996055.png", // burger
  ]
};

export const StickerSelector = ({ element, onUpdate }: StickerSelectorProps) => {
  const stickerData = element.data as StickerElementData;
  const [selectedSticker, setSelectedSticker] = useState(stickerData.src);

  const handleStickerSelect = (stickerUrl: string) => {
    setSelectedSticker(stickerUrl);
  };

  const handleSave = () => {
    const updatedElement = {
      ...element,
      data: {
        ...stickerData,
        src: selectedSticker
      }
    };
    onUpdate(updatedElement);
    toast.success("Sticker updated");
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-center mb-4">
        <div className="h-32 w-32 flex items-center justify-center bg-muted rounded-md">
          <img 
            src={selectedSticker} 
            alt="Selected sticker" 
            className="h-24 w-24 object-contain" 
          />
        </div>
      </div>

      <Tabs defaultValue="favorites">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="emoji">Emoji</TabsTrigger>
          <TabsTrigger value="nature">Nature</TabsTrigger>
          <TabsTrigger value="food">Food</TabsTrigger>
        </TabsList>
        
        {Object.entries(STICKERS).map(([category, stickers]) => (
          <TabsContent key={category} value={category} className="h-48">
            <ScrollArea className="h-full w-full">
              <div className="grid grid-cols-4 gap-2 p-2">
                {stickers.map((sticker, index) => (
                  <div 
                    key={index} 
                    className={`h-16 w-16 cursor-pointer p-2 rounded-md flex items-center justify-center 
                      ${selectedSticker === sticker ? 'bg-primary/20 border border-primary' : 'hover:bg-secondary'}`}
                    onClick={() => handleStickerSelect(sticker)}
                  >
                    <img 
                      src={sticker} 
                      alt={`Sticker ${index}`} 
                      className="h-full w-full object-contain" 
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>

      <div className="pt-4">
        <Button onClick={handleSave} className="w-full">Apply Sticker</Button>
      </div>
    </div>
  );
};
