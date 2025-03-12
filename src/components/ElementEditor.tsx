
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TextEditor } from "./editors/TextEditor";
import { ImageEditor } from "./editors/ImageEditor";
import { StickerSelector } from "./editors/StickerSelector";
import { ScrapbookElement, ElementType } from "@/types/scrapbook";

interface ElementEditorProps {
  isOpen: boolean;
  onClose: () => void;
  element: ScrapbookElement | null;
  onElementUpdate: (updatedElement: ScrapbookElement) => void;
}

export const ElementEditor = ({ 
  isOpen, 
  onClose, 
  element, 
  onElementUpdate 
}: ElementEditorProps) => {
  if (!element) return null;

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
        <DialogHeader>
          <DialogTitle>Edit {element.type}</DialogTitle>
        </DialogHeader>
        {renderEditor()}
      </DialogContent>
    </Dialog>
  );
};
