
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TextEditor } from "./editors/TextEditor";
import { ImageEditor } from "./editors/ImageEditor";
import { StickerSelector } from "./editors/StickerSelector";
import { ScrapbookElement, ElementType } from "@/types/scrapbook";
import { X } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose
} from "@/components/ui/drawer";

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

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="max-h-[85vh] overflow-y-auto">
          <DrawerHeader className="flex flex-row justify-between items-center">
            <DrawerTitle>Edit {element.type}</DrawerTitle>
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
              <DrawerClose className="p-1 hover:bg-muted rounded-md">
                <X className="h-4 w-4" />
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div className="p-4 pb-8">
            {renderEditor()}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row justify-between items-center sticky top-0 bg-background z-10 pb-2 border-b">
          <DialogTitle>Edit {element.type}</DialogTitle>
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
            <button 
              onClick={onClose}
              className="p-1 hover:bg-muted rounded-md"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>
        <div className="overflow-y-auto pr-1 py-2">
          {renderEditor()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
