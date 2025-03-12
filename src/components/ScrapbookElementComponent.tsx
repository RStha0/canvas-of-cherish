
import { ScrapbookElement, ElementType, TextElementData, ImageElementData, StickerElementData } from "@/types/scrapbook";
import { Trash, RotateCw, Maximize, Minimize } from "lucide-react";

interface ScrapbookElementComponentProps {
  element: ScrapbookElement;
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  isActive: boolean;
  onRemove?: (elementId: string) => void;
  onRotate?: (elementId: string, angle: number) => void;
  onResize?: (elementId: string, scale: number) => void;
}

export const ScrapbookElementComponent = ({
  element,
  onMouseDown,
  onDoubleClick,
  isActive,
  onRemove,
  onRotate,
  onResize
}: ScrapbookElementComponentProps) => {
  const commonStyles = {
    left: `${element.x}px`,
    top: `${element.y}px`,
    zIndex: element.zIndex,
    transform: isActive ? 'scale(1.02)' : 'scale(1)',
    border: isActive ? '2px dashed #6366f1' : 'none'
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(element.id);
    }
  };

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRotate) {
      // Rotate by 15 degrees each click
      const currentRotation = 
        element.type === ElementType.IMAGE ? (element.data as ImageElementData).rotation || 0 :
        element.type === ElementType.STICKER ? (element.data as StickerElementData).rotation || 0 : 0;
      
      onRotate(element.id, (currentRotation + 15) % 360);
    }
  };

  const handleResize = (increase: boolean) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onResize) {
      // Scale by 10% each click
      const scale = increase ? 1.1 : 0.9;
      onResize(element.id, scale);
    }
  };

  // Controls overlay that shows when element is active
  const renderControls = () => {
    if (!isActive) return null;
    
    return (
      <div className="absolute -top-10 right-0 flex gap-1 bg-white/80 p-1 rounded-md shadow-sm z-50">
        <button 
          onClick={handleRotate}
          className="p-1 hover:bg-gray-100 rounded-md"
          aria-label="Rotate element"
        >
          <RotateCw className="h-4 w-4 text-gray-700" />
        </button>
        <button 
          onClick={handleResize(true)}
          className="p-1 hover:bg-gray-100 rounded-md"
          aria-label="Increase size"
        >
          <Maximize className="h-4 w-4 text-gray-700" />
        </button>
        <button 
          onClick={handleResize(false)}
          className="p-1 hover:bg-gray-100 rounded-md"
          aria-label="Decrease size"
        >
          <Minimize className="h-4 w-4 text-gray-700" />
        </button>
        <button 
          onClick={handleRemove}
          className="p-1 hover:bg-red-100 rounded-md"
          aria-label="Remove element"
        >
          <Trash className="h-4 w-4 text-red-500" />
        </button>
      </div>
    );
  };

  switch (element.type) {
    case ElementType.TEXT:
      const textData = element.data as TextElementData;
      return (
        <div
          id={element.id}
          className="scrapbook-text"
          style={{
            ...commonStyles,
            fontFamily: textData.fontFamily || 'inherit',
            fontSize: `${textData.fontSize || 16}px`,
            color: textData.color || 'black',
            transform: isActive ? 'scale(1.02)' : 'scale(1)',
            backgroundColor: textData.backgroundColor || 'transparent',
            padding: '8px',
            maxWidth: '300px',
            textAlign: textData.textAlign || 'left' as any,
            fontWeight: textData.fontWeight || 'normal'
          }}
          onMouseDown={onMouseDown}
          onDoubleClick={onDoubleClick}
        >
          {renderControls()}
          {textData.content}
        </div>
      );

    case ElementType.IMAGE:
      const imageData = element.data as ImageElementData;
      return (
        <div
          id={element.id}
          className="scrapbook-photo"
          style={{
            ...commonStyles,
            width: `${imageData.width || 200}px`,
            height: `${imageData.height || 150}px`,
            transform: `${isActive ? 'scale(1.02)' : 'scale(1)'} rotate(${imageData.rotation || 0}deg)`,
          }}
          onMouseDown={onMouseDown}
          onDoubleClick={onDoubleClick}
        >
          {renderControls()}
          <img
            src={imageData.src}
            alt={imageData.alt || "Scrapbook image"}
            className="w-full h-full object-cover"
          />
        </div>
      );

    case ElementType.STICKER:
      const stickerData = element.data as StickerElementData;
      return (
        <div
          id={element.id}
          className="scrapbook-sticker"
          style={{
            ...commonStyles,
            width: `${stickerData.width || 80}px`,
            height: `${stickerData.height || 80}px`,
            transform: `${isActive ? 'scale(1.05)' : 'scale(1)'} rotate(${stickerData.rotation || 0}deg)`,
          }}
          onMouseDown={onMouseDown}
          onDoubleClick={onDoubleClick}
        >
          {renderControls()}
          <img
            src={stickerData.src}
            alt={stickerData.alt || "Sticker"}
            className="w-full h-full object-contain"
          />
        </div>
      );

    default:
      return (
        <div
          id={element.id}
          className="scrapbook-element"
          style={{
            ...commonStyles,
            width: '100px',
            height: '100px',
            backgroundColor: '#f3f4f6'
          }}
          onMouseDown={onMouseDown}
          onDoubleClick={onDoubleClick}
        >
          {renderControls()}
          Unknown Element
        </div>
      );
  }
};
