
import { ScrapbookElement, ElementType, TextElementData, ImageElementData, StickerElementData } from "@/types/scrapbook";
import { Image, Type, Sticker } from "lucide-react";

interface ScrapbookElementComponentProps {
  element: ScrapbookElement;
  onMouseDown: (e: React.MouseEvent) => void;
  isActive: boolean;
}

export const ScrapbookElementComponent = ({
  element,
  onMouseDown,
  isActive
}: ScrapbookElementComponentProps) => {
  const commonStyles = {
    left: `${element.x}px`,
    top: `${element.y}px`,
    zIndex: element.zIndex,
    transform: isActive ? 'scale(1.02)' : 'scale(1)',
    border: isActive ? '2px dashed #6366f1' : 'none'
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
        >
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
        >
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
        >
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
        >
          Unknown Element
        </div>
      );
  }
};
