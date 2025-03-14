
import { useState } from "react";
import { ScrapbookElement, ElementType, TextElementData, ImageElementData, StickerElementData } from "@/types/scrapbook";
import { Trash, RotateCw, Maximize, Minimize, Check, X } from "lucide-react";
import { TextEditor } from "./editors/TextEditor";
import { ImageEditor } from "./editors/ImageEditor";
import { StickerSelector } from "./editors/StickerSelector";
import { Button } from "@/components/ui/button";

interface ScrapbookElementComponentProps {
  element: ScrapbookElement;
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  isActive: boolean;
  onRemove?: (elementId: string) => void;
  onRotate?: (elementId: string, angle: number) => void;
  onResize?: (elementId: string, scale: number) => void;
  onUpdate?: (updatedElement: ScrapbookElement) => void;
}

export const ScrapbookElementComponent = ({
  element,
  onMouseDown,
  onDoubleClick,
  isActive,
  onRemove,
  onRotate,
  onResize,
  onUpdate
}: ScrapbookElementComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);

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

  const handleStartEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleElementUpdate = (updatedElement: ScrapbookElement) => {
    if (onUpdate) {
      onUpdate(updatedElement);
    }
    setIsEditing(false);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
  };

  // Controls overlay that shows when element is active
  const renderControls = () => {
    if (!isActive || isEditing) return null;
    
    return (
      <div className="absolute -top-10 right-0 flex gap-1 bg-white/80 p-1 rounded-md shadow-sm z-50">
        <button 
          onClick={handleStartEditing}
          className="p-1 hover:bg-blue-100 rounded-md"
          aria-label="Edit element"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
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

  // Render inline editor controls
  const renderEditorControls = () => {
    if (!isEditing) return null;

    return (
      <div className="absolute -bottom-10 right-0 flex gap-1 bg-white/80 p-1 rounded-md shadow-sm z-50">
        <Button 
          onClick={handleCancelEditing}
          size="sm"
          variant="outline"
          className="p-1 h-8 w-8"
        >
          <X className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    );
  };

  // Render inline editor component based on element type
  const renderEditor = () => {
    if (!isEditing || !onUpdate) return null;

    switch (element.type) {
      case ElementType.TEXT:
        return (
          <div className="p-2 bg-white/95 rounded shadow-lg">
            <TextEditor 
              element={element} 
              onUpdate={handleElementUpdate} 
            />
          </div>
        );
      case ElementType.IMAGE:
        return (
          <div className="p-2 bg-white/95 rounded shadow-lg">
            <ImageEditor 
              element={element} 
              onUpdate={handleElementUpdate} 
            />
          </div>
        );
      case ElementType.STICKER:
        return (
          <div className="p-2 bg-white/95 rounded shadow-lg">
            <StickerSelector 
              element={element} 
              onUpdate={handleElementUpdate} 
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (isEditing) {
    return (
      <div
        id={element.id}
        className="scrapbook-element-editor absolute"
        style={{
          ...commonStyles,
          minWidth: '300px',
          maxWidth: '400px',
          zIndex: 9999
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {renderEditor()}
        {renderEditorControls()}
      </div>
    );
  }

  switch (element.type) {
    case ElementType.TEXT:
      const textData = element.data as TextElementData;
      return (
        <div
          id={element.id}
          className="scrapbook-text absolute"
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
          onDoubleClick={(e) => handleStartEditing(e)}
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
          className="scrapbook-photo absolute"
          style={{
            ...commonStyles,
            width: `${imageData.width || 200}px`,
            height: `${imageData.height || 150}px`,
            transform: `${isActive ? 'scale(1.02)' : 'scale(1)'} rotate(${imageData.rotation || 0}deg)`,
            transformOrigin: 'center',
          }}
          onMouseDown={onMouseDown}
          onDoubleClick={(e) => handleStartEditing(e)}
        >
          {renderControls()}
          <img
            src={imageData.src}
            alt={imageData.alt || "Scrapbook image"}
            className="w-full h-full object-contain"
            draggable="false"
          />
        </div>
      );

    case ElementType.STICKER:
      const stickerData = element.data as StickerElementData;
      return (
        <div
          id={element.id}
          className="scrapbook-sticker absolute"
          style={{
            ...commonStyles,
            width: `${stickerData.width || 80}px`,
            height: `${stickerData.height || 80}px`,
            transform: `${isActive ? 'scale(1.05)' : 'scale(1)'} rotate(${stickerData.rotation || 0}deg)`,
            transformOrigin: 'center',
          }}
          onMouseDown={onMouseDown}
          onDoubleClick={(e) => handleStartEditing(e)}
        >
          {renderControls()}
          <img
            src={stickerData.src}
            alt={stickerData.alt || "Sticker"}
            className="w-full h-full object-contain"
            draggable="false"
          />
        </div>
      );

    default:
      return (
        <div
          id={element.id}
          className="scrapbook-element absolute"
          style={{
            ...commonStyles,
            width: '100px',
            height: '100px',
            backgroundColor: '#f3f4f6'
          }}
          onMouseDown={onMouseDown}
          onDoubleClick={(e) => handleStartEditing(e)}
        >
          {renderControls()}
          Unknown Element
        </div>
      );
  }
};
