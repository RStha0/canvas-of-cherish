
import { useState, useRef, useEffect } from "react";
import { ScrapbookElement, ElementType, TextElementData, ImageElementData, StickerElementData } from "@/types/scrapbook";
import { Trash, RotateCw, Maximize, Minimize, Check, X, Move } from "lucide-react";
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
  const [initialTouchDistance, setInitialTouchDistance] = useState(0);
  const [initialScale, setInitialScale] = useState(1);
  const [initialTouchAngle, setInitialTouchAngle] = useState(0);
  const [initialRotation, setInitialRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [isScaling, setIsScaling] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  
  const elementRef = useRef<HTMLDivElement>(null);
  const rotateHandleRef = useRef<HTMLDivElement>(null);
  const scaleHandleRef = useRef<HTMLDivElement>(null);

  const commonStyles = {
    left: `${element.x}px`,
    top: `${element.y}px`,
    zIndex: element.zIndex,
    transform: isActive ? 'scale(1.02)' : 'scale(1)',
    border: isActive ? '2px dashed #6366f1' : 'none'
  };

  // Get current rotation value based on element type
  const getCurrentRotation = () => {
    if (element.type === ElementType.IMAGE) {
      return (element.data as ImageElementData).rotation || 0;
    } else if (element.type === ElementType.STICKER) {
      return (element.data as StickerElementData).rotation || 0;
    }
    return 0;
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
      const currentRotation = getCurrentRotation();
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

  // Rotation handle drag logic
  const handleRotateMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!elementRef.current) return;
    
    setIsRotating(true);
    
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate initial angle
    const initialAngle = Math.atan2(
      e.clientY - centerY,
      e.clientX - centerX
    ) * 180 / Math.PI;
    
    setInitialRotation(getCurrentRotation());
    setStartPoint({ x: e.clientX, y: e.clientY });
    setInitialTouchAngle(initialAngle);
    
    document.addEventListener('mousemove', handleRotateMouseMove);
    document.addEventListener('mouseup', handleRotateMouseUp);
  };
  
  const handleRotateMouseMove = (e: MouseEvent) => {
    if (!isRotating || !elementRef.current) return;
    
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate current angle
    const currentAngle = Math.atan2(
      e.clientY - centerY,
      e.clientX - centerX
    ) * 180 / Math.PI;
    
    // Calculate angle difference
    const angleDelta = currentAngle - initialTouchAngle;
    
    // Calculate new rotation (snap to 15-degree increments)
    const newRotation = Math.round((initialRotation + angleDelta) / 15) * 15;
    
    // Apply rotation
    if (onRotate) {
      onRotate(element.id, (newRotation + 360) % 360);
    }
  };
  
  const handleRotateMouseUp = () => {
    setIsRotating(false);
    document.removeEventListener('mousemove', handleRotateMouseMove);
    document.removeEventListener('mouseup', handleRotateMouseUp);
  };

  // Scale handle drag logic
  const handleScaleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!elementRef.current) return;
    
    setIsScaling(true);
    setStartPoint({ x: e.clientX, y: e.clientY });
    
    // Find the current scale based on element type
    let currentScale = 1;
    if (element.type === ElementType.IMAGE) {
      const imageData = element.data as ImageElementData;
      // Approximate scale from width
      currentScale = (imageData.width || 200) / 200;
    } else if (element.type === ElementType.STICKER) {
      const stickerData = element.data as StickerElementData;
      // Approximate scale from width
      currentScale = (stickerData.width || 80) / 80;
    } else if (element.type === ElementType.TEXT) {
      const textData = element.data as TextElementData;
      // Approximate scale from font size
      currentScale = (textData.fontSize || 18) / 18;
    }
    
    setInitialScale(currentScale);
    
    document.addEventListener('mousemove', handleScaleMouseMove);
    document.addEventListener('mouseup', handleScaleMouseUp);
  };
  
  const handleScaleMouseMove = (e: MouseEvent) => {
    if (!isScaling || !elementRef.current) return;
    
    const deltaX = e.clientX - startPoint.x;
    const deltaY = e.clientY - startPoint.y;
    
    // Use the maximum delta for consistent scaling
    const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
    
    // Scale factor (adjust sensitivity)
    const scaleFactor = 1 + delta / 200;
    
    // Apply scale
    if (onResize) {
      onResize(element.id, initialScale * scaleFactor);
    }
  };
  
  const handleScaleMouseUp = () => {
    setIsScaling(false);
    document.removeEventListener('mousemove', handleScaleMouseMove);
    document.removeEventListener('mouseup', handleScaleMouseUp);
  };

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.stopPropagation();
      e.preventDefault();
      
      // Get center point between the two touches
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      
      // Get the distance between the two touch points for scaling
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      // Get the angle between the two touch points for rotation
      const angle = Math.atan2(
        e.touches[1].clientY - e.touches[0].clientY,
        e.touches[1].clientX - e.touches[0].clientX
      ) * 180 / Math.PI;
      
      setInitialTouchDistance(distance);
      setInitialScale(1); // This will be used as a base, actual scale is determined by element type
      setInitialTouchAngle(angle);
      setInitialRotation(getCurrentRotation());
      
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      document.addEventListener('touchcancel', handleTouchEnd);
    }
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      
      // Calculate new distance for scaling
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      // Calculate scale factor
      const scaleFactor = distance / initialTouchDistance;
      
      // Calculate rotation angle
      const angle = Math.atan2(
        e.touches[1].clientY - e.touches[0].clientY,
        e.touches[1].clientX - e.touches[0].clientX
      ) * 180 / Math.PI;
      
      const angleDelta = angle - initialTouchAngle;
      
      // Apply both transformations
      if (onRotate) {
        const newRotation = (initialRotation + angleDelta + 360) % 360;
        onRotate(element.id, Math.round(newRotation / 15) * 15); // Snap to 15-degree increments
      }
      
      if (onResize) {
        onResize(element.id, initialScale * scaleFactor);
      }
    }
  };
  
  const handleTouchEnd = () => {
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    document.removeEventListener('touchcancel', handleTouchEnd);
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

  // Render transform handles (only when active and not editing)
  const renderTransformHandles = () => {
    if (!isActive || isEditing) return null;
    
    return (
      <>
        {/* Rotation handle */}
        <div
          ref={rotateHandleRef}
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rounded-full border-2 border-blue-500 cursor-pointer z-50 flex items-center justify-center"
          onMouseDown={handleRotateMouseDown}
          onTouchStart={(e) => {
            // Handle touch rotation
            if (e.touches.length === 1) {
              e.preventDefault();
              const touch = e.touches[0];
              handleRotateMouseDown({
                ...e,
                clientX: touch.clientX,
                clientY: touch.clientY,
                preventDefault: () => e.preventDefault(),
                stopPropagation: () => e.stopPropagation()
              } as any);
            }
          }}
        >
          <RotateCw className="h-3 w-3 text-blue-500" />
        </div>
        
        {/* Scale handle */}
        <div
          ref={scaleHandleRef}
          className="absolute -bottom-6 -right-6 w-6 h-6 bg-white rounded-full border-2 border-green-500 cursor-nwse-resize z-50 flex items-center justify-center"
          onMouseDown={handleScaleMouseDown}
          onTouchStart={(e) => {
            // Handle touch scaling
            if (e.touches.length === 1) {
              e.preventDefault();
              const touch = e.touches[0];
              handleScaleMouseDown({
                ...e,
                clientX: touch.clientX,
                clientY: touch.clientY,
                preventDefault: () => e.preventDefault(),
                stopPropagation: () => e.stopPropagation()
              } as any);
            }
          }}
        >
          <Maximize className="h-3 w-3 text-green-500" />
        </div>
        
        {/* Drag indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none opacity-30 flex items-center justify-center">
          <Move className="h-6 w-6 text-gray-500" />
        </div>
      </>
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
        ref={elementRef}
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
          ref={elementRef}
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
            fontWeight: textData.fontWeight || 'normal',
            fontStyle: textData.fontStyle || 'normal'
          }}
          onMouseDown={onMouseDown}
          onDoubleClick={(e) => handleStartEditing(e)}
          onTouchStart={handleTouchStart}
        >
          {renderControls()}
          {renderTransformHandles()}
          {textData.content}
        </div>
      );

    case ElementType.IMAGE:
      const imageData = element.data as ImageElementData;
      return (
        <div
          id={element.id}
          ref={elementRef}
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
          onTouchStart={handleTouchStart}
        >
          {renderControls()}
          {renderTransformHandles()}
          <img
            src={imageData.src}
            alt={imageData.alt || "Scrapbook image"}
            className="w-full h-full object-contain"
            draggable="false"
            style={{
              filter: imageData.filters ? 
                `brightness(${imageData.filters.brightness || 100}%) 
                contrast(${imageData.filters.contrast || 100}%) 
                saturate(${imageData.filters.saturation || 100}%)` : 
                'none'
            }}
          />
        </div>
      );

    case ElementType.STICKER:
      const stickerData = element.data as StickerElementData;
      return (
        <div
          id={element.id}
          ref={elementRef}
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
          onTouchStart={handleTouchStart}
        >
          {renderControls()}
          {renderTransformHandles()}
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
          ref={elementRef}
          className="scrapbook-element absolute"
          style={{
            ...commonStyles,
            width: '100px',
            height: '100px',
            backgroundColor: '#f3f4f6'
          }}
          onMouseDown={onMouseDown}
          onDoubleClick={(e) => handleStartEditing(e)}
          onTouchStart={handleTouchStart}
        >
          {renderControls()}
          {renderTransformHandles()}
          Unknown Element
        </div>
      );
  }
};
