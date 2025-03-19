
import { X } from "lucide-react";
import { TextEditor } from "./editors/TextEditor";
import { ImageEditor } from "./editors/ImageEditor";
import { StickerSelector } from "./editors/StickerSelector";
import { ScrapbookElement, ElementType } from "@/types/scrapbook";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";

interface ElementEditorProps {
  isOpen: boolean;
  onClose: () => void;
  element: ScrapbookElement | null;
  onElementUpdate: (updatedElement: ScrapbookElement) => void;
  onElementRemove?: (elementId: string) => void;
}

export const ElementEditor = ({ 
  isOpen, 
  onClose, 
  element, 
  onElementUpdate,
  onElementRemove
}: ElementEditorProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  if (!element) return null;

  const handleRemove = () => {
    if (onElementRemove) {
      onElementRemove(element.id);
      onClose();
    }
  };

  // Different editor based on element type
  const renderEditor = () => {
    switch (element.type) {
      case ElementType.TEXT:
        return <TextEditor element={element} onUpdate={onElementUpdate} />;
      case ElementType.IMAGE:
        return <ImageEditor element={element} onUpdate={onElementUpdate} />;
      case ElementType.STICKER:
        return <StickerSelector element={element} onUpdate={onElementUpdate} />;
      default:
        return <div>Editor not available for this element type</div>;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "h-[85vh] pb-12" : "w-[400px] max-w-full"}>
        <SheetHeader className="sticky top-0 z-10 bg-background border-b pb-2 flex flex-row justify-between items-center">
          <SheetTitle>Edit {element.type}</SheetTitle>
          <div className="flex gap-2">
            {onElementRemove && (
              <button 
                onClick={handleRemove}
                className="p-1 hover:bg-red-100 rounded-md"
                aria-label="Remove element"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            )}
            <SheetClose className="p-1 hover:bg-muted rounded-md">
              <X className="h-4 w-4" />
            </SheetClose>
          </div>
        </SheetHeader>
        <div className="pt-4 overflow-y-auto h-full pb-16">
          {renderEditor()}
        </div>
      </SheetContent>
    </Sheet>
  );
};
