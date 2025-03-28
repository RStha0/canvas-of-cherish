import { useState, useRef, useEffect } from "react";
import { ScrapbookElement, ElementType, ImageElementData, StickerElementData, TextElementData } from "@/types/scrapbook";
import { ScrapbookElementComponent } from "./ScrapbookElementComponent";
import { toast } from "sonner";

interface ScrapbookPageCanvasProps {
  elements: ScrapbookElement[];
  onElementsChange: (elements: ScrapbookElement[]) => void;
  background?: string;
  onEditElement?: (element: ScrapbookElement) => void;
}

export const ScrapbookPageCanvas = ({
  elements,
  onElementsChange,
  background = "bg-scrapbook-page texture-paper",
  onEditElement
}: ScrapbookPageCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleElementMouseDown = (
    e: React.MouseEvent,
    elementId: string
  ) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    setActiveElement(elementId);
    setIsDragging(true);

    const rect = element.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    const updatedElements = elements.map(el => {
      if (el.id === elementId) {
        return { ...el, zIndex: Math.max(...elements.map(e => e.zIndex)) + 1 };
      }
      return el;
    });
    onElementsChange(updatedElements);

    e.preventDefault();
  };

  const handleElementDoubleClick = (
    e: React.MouseEvent,
    elementId: string
  ) => {
    const element = elements.find(el => el.id === elementId);
    if (!element || !onEditElement) return;
    
    onEditElement(element);
    e.stopPropagation();
  };

  const handleRemoveElement = (elementId: string) => {
    const updatedElements = elements.filter(el => el.id !== elementId);
    onElementsChange(updatedElements);
    setActiveElement(null);
    toast.success("Element removed");
  };

  const handleRotateElement = (elementId: string, angle: number) => {
    const updatedElements = elements.map(el => {
      if (el.id === elementId) {
        switch (el.type) {
          case ElementType.IMAGE: {
            const imageData = el.data as ImageElementData;
            return {
              ...el,
              data: {
                ...imageData,
                rotation: angle
              }
            };
          }
          case ElementType.STICKER: {
            const stickerData = el.data as StickerElementData;
            return {
              ...el,
              data: {
                ...stickerData,
                rotation: angle
              }
            };
          }
          default:
            return el;
        }
      }
      return el;
    });
    onElementsChange(updatedElements);
  };

  const handleResizeElement = (elementId: string, scale: number) => {
    const updatedElements = elements.map(el => {
      if (el.id === elementId) {
        switch (el.type) {
          case ElementType.IMAGE: {
            const imageData = el.data as ImageElementData;
            const aspectRatio = (imageData.width && imageData.height) ? 
              (imageData.width / imageData.height) : 1;
              
            const newWidth = Math.max(50, Math.round((imageData.width || 200) * scale));
            
            return {
              ...el,
              data: {
                ...imageData,
                width: newWidth,
                height: Math.round(newWidth / aspectRatio)
              }
            };
          }
          case ElementType.STICKER: {
            const stickerData = el.data as StickerElementData;
            return {
              ...el,
              data: {
                ...stickerData,
                width: Math.max(30, Math.round((stickerData.width || 80) * scale)),
                height: Math.max(30, Math.round((stickerData.height || 80) * scale))
              }
            };
          }
          case ElementType.TEXT: {
            const textData = el.data as TextElementData;
            return {
              ...el,
              data: {
                ...textData,
                fontSize: Math.max(10, Math.round((textData.fontSize || 18) * scale))
              }
            };
          }
          default:
            return el;
        }
      }
      return el;
    });
    onElementsChange(updatedElements);
  };

  const handleElementUpdate = (updatedElement: ScrapbookElement) => {
    const updatedElements = elements.map(el => 
      el.id === updatedElement.id ? updatedElement : el
    );
    onElementsChange(updatedElements);
    toast.success("Element updated");
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !activeElement || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const canvasRect = canvas.getBoundingClientRect();

      const newX = Math.max(0, Math.min(e.clientX - canvasRect.left - dragOffset.x, canvasRect.width - 100));
      const newY = Math.max(0, Math.min(e.clientY - canvasRect.top - dragOffset.y, canvasRect.height - 100));

      const updatedElements = elements.map(el => {
        if (el.id === activeElement) {
          return {
            ...el,
            x: newX,
            y: newY
          };
        }
        return el;
      });

      onElementsChange(updatedElements);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !activeElement || !canvasRef.current || e.touches.length === 0) return;
      
      const touch = e.touches[0];
      const canvas = canvasRef.current;
      const canvasRect = canvas.getBoundingClientRect();

      const newX = Math.max(0, Math.min(touch.clientX - canvasRect.left - dragOffset.x, canvasRect.width - 100));
      const newY = Math.max(0, Math.min(touch.clientY - canvasRect.top - dragOffset.y, canvasRect.height - 100));

      const updatedElements = elements.map(el => {
        if (el.id === activeElement) {
          return {
            ...el,
            x: newX,
            y: newY
          };
        }
        return el;
      });

      onElementsChange(updatedElements);
      e.preventDefault();
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };
    
    const handleCanvasClick = (e: MouseEvent) => {
      if (e.target === canvasRef.current) {
        setActiveElement(null);
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleTouchEnd);
      document.addEventListener("touchcancel", handleTouchEnd);
    }
    
    canvasRef.current?.addEventListener("click", handleCanvasClick);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
      canvasRef.current?.removeEventListener("click", handleCanvasClick);
    };
  }, [isDragging, activeElement, elements, dragOffset, onElementsChange]);

  return (
    <div 
      ref={canvasRef} 
      className={`scrapbook-canvas ${background} page-shadow relative h-full`}
    >
      {elements.map((element) => (
        <ScrapbookElementComponent
          key={element.id}
          element={element}
          onMouseDown={(e) => handleElementMouseDown(e, element.id)}
          onDoubleClick={(e) => handleElementDoubleClick(e, element.id)}
          isActive={element.id === activeElement}
          onRemove={handleRemoveElement}
          onRotate={handleRotateElement}
          onResize={handleResizeElement}
          onUpdate={handleElementUpdate}
        />
      ))}
    </div>
  );
};
