
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TextEditor } from "./editors/TextEditor";
import { ImageEditor } from "./editors/ImageEditor";
import { StickerSelector } from "./editors/StickerSelector";
import { ScrapbookElement, ElementType } from "@/types/scrapbook";
import { X } from "lucide-react";

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Edit {element.type}</DialogTitle>
          {onElementRemove && (
            <button 
              onClick={handleRemove}
              className="p-1 hover:bg-red-100 rounded-md"
              aria-label="Remove element"
            >
              <X className="h-4 w-4 text-red-500" />
            </button>
          )}
        </DialogHeader>
        {renderEditor()}
      </DialogContent>
    </Dialog>
  );
};
