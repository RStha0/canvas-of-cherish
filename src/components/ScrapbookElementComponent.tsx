
import { ScrapbookElement, ElementType } from "@/types/scrapbook";
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
      return (
        <div
          id={element.id}
          className="scrapbook-text"
          style={{
            ...commonStyles,
            fontFamily: element.data.fontFamily || 'inherit',
            fontSize: `${element.data.fontSize || 16}px`,
            color: element.data.color || 'black',
            transform: isActive ? 'scale(1.02)' : 'scale(1)',
            backgroundColor: element.data.backgroundColor || 'transparent',
            padding: '8px',
            maxWidth: '300px',
            textAlign: element.data.textAlign || 'left' as any,
            fontWeight: element.data.fontWeight || 'normal'
          }}
          onMouseDown={onMouseDown}
        >
          {element.data.content}
        </div>
      );

    case ElementType.IMAGE:
      return (
        <div
          id={element.id}
          className="scrapbook-photo"
          style={{
            ...commonStyles,
            width: `${element.data.width || 200}px`,
            height: `${element.data.height || 150}px`,
            transform: `${isActive ? 'scale(1.02)' : 'scale(1)'} rotate(${element.data.rotation || 0}deg)`,
          }}
          onMouseDown={onMouseDown}
        >
          <img
            src={element.data.src}
            alt={element.data.alt || "Scrapbook image"}
            className="w-full h-full object-cover"
          />
        </div>
      );

    case ElementType.STICKER:
      return (
        <div
          id={element.id}
          className="scrapbook-sticker"
          style={{
            ...commonStyles,
            width: `${element.data.width || 80}px`,
            height: `${element.data.height || 80}px`,
            transform: `${isActive ? 'scale(1.05)' : 'scale(1)'} rotate(${element.data.rotation || 0}deg)`,
          }}
          onMouseDown={onMouseDown}
        >
          <img
            src={element.data.src}
            alt={element.data.alt || "Sticker"}
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
