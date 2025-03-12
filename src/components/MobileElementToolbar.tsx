
import { Button } from "@/components/ui/button";
import { ElementType } from "@/types/scrapbook";
import { Image, Type, Sticker, Share, X, Plus, Download, Palette } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";

interface MobileElementToolbarProps {
  onAddElement: (elementType: ElementType) => void;
  onChangeBackground: (background: string) => void;
  onSave: () => void;
  onShare: () => void;
}

export const MobileElementToolbar = ({ 
  onAddElement, 
  onChangeBackground, 
  onSave,
  onShare 
}: MobileElementToolbarProps) => {
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
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
      <div className="inline-flex items-center gap-2 p-2 bg-secondary/80 backdrop-blur-sm rounded-full shadow-lg border">
        {/* Quick Access Buttons */}
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-primary/10" 
          onClick={handleAddText}
        >
          <Type className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-primary/10" 
          onClick={handleAddImage}
        >
          <Image className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-primary/10" 
          onClick={handleAddSticker}
        >
          <Sticker className="h-5 w-5" />
        </Button>
        
        {/* More Options Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="default" size="icon" className="rounded-full">
              <Plus className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-xl">
            <div className="pt-6 pb-16 space-y-5">
              <h3 className="text-lg font-handwritten text-center">Customize Your Page</h3>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium mb-2">Add Elements</h4>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="flex flex-col h-20 gap-1 items-center justify-center" 
                    onClick={handleAddText}
                  >
                    <Type className="h-6 w-6" />
                    <span className="text-xs">Text</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="flex flex-col h-20 gap-1 items-center justify-center" 
                    onClick={handleAddImage}
                  >
                    <Image className="h-6 w-6" />
                    <span className="text-xs">Photo</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="flex flex-col h-20 gap-1 items-center justify-center" 
                    onClick={handleAddSticker}
                  >
                    <Sticker className="h-6 w-6" />
                    <span className="text-xs">Sticker</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium mb-2">Page Background</h4>
                <div className="grid grid-cols-3 gap-2">
                  {backgrounds.map((bg) => (
                    <div
                      key={bg.value}
                      className={`h-14 rounded cursor-pointer border-2 flex items-center justify-center ${bg.value === "bg-scrapbook-page texture-paper" ? "texture-paper" : bg.value}`}
                      onClick={() => {
                        onChangeBackground(bg.value);
                        toast.success(`Background changed to ${bg.name}`);
                      }}
                    >
                      <span className="text-xs font-medium text-gray-700 bg-white/70 px-1 rounded">
                        {bg.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={onSave}
                  className="h-12"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={onShare}
                  className="h-12"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-primary/10" 
          onClick={onShare}
        >
          <Share className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
