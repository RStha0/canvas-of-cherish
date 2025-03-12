
import { useState, useRef, useEffect } from "react";
import { ScrapbookElement, ElementType, ImageElementData, StickerElementData } from "@/types/scrapbook";
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

    // Calculate the offset from the mouse position to the element's top-left corner
    const rect = element.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    // Bring the element to the front by increasing its z-index
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
        if (el.type === ElementType.IMAGE) {
          const imageData = el.data as ImageElementData;
          return {
            ...el,
            data: {
              ...imageData,
              rotation: angle
            }
          };
        } else if (el.type === ElementType.STICKER) {
          const stickerData = el.data as StickerElementData;
          return {
            ...el,
            data: {
              ...stickerData,
              rotation: angle
            }
          };
        }
      }
      return el;
    });
    onElementsChange(updatedElements);
  };

  const handleResizeElement = (elementId: string, scale: number) => {
    const updatedElements = elements.map(el => {
      if (el.id === elementId) {
        if (el.type === ElementType.IMAGE) {
          const imageData = el.data as ImageElementData;
          return {
            ...el,
            data: {
              ...imageData,
              width: Math.max(50, Math.round((imageData.width || 200) * scale)),
              height: Math.max(50, Math.round((imageData.height || 150) * scale))
            }
          };
        } else if (el.type === ElementType.STICKER) {
          const stickerData = el.data as StickerElementData;
          return {
            ...el,
            data: {
              ...stickerData,
              width: Math.max(30, Math.round((stickerData.width || 80) * scale)),
              height: Math.max(30, Math.round((stickerData.height || 80) * scale))
            }
          };
        } else if (el.type === ElementType.TEXT) {
          return {
            ...el,
            data: {
              ...el.data,
              fontSize: Math.max(10, Math.round((el.data.fontSize || 18) * scale))
            }
          };
        }
      }
      return el;
    });
    onElementsChange(updatedElements);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !activeElement || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const canvasRect = canvas.getBoundingClientRect();

      // Calculate new position, keeping the element within canvas bounds
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

      // Calculate new position for touch devices, keeping the element within canvas bounds
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
      e.preventDefault(); // Prevent page scrolling while dragging
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };
    
    // For clicks outside elements, deselect active element
    const handleCanvasClick = (e: MouseEvent) => {
      if (e.target === canvasRef.current) {
        setActiveElement(null);
      }
    };

    if (isDragging) {
      // Mouse events
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      
      // Touch events
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
      className={`scrapbook-canvas ${background} page-shadow`}
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
        />
      ))}
    </div>
  );
};
