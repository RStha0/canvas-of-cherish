
import { useState, useRef, useEffect } from "react";
import { ScrapbookElement, ImageElementData } from "@/types/scrapbook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ImagePlus, RotateCcw, RotateCw, Maximize, Minimize, Crop, ImageFilter, Contrast, Droplet } from "lucide-react";
import { toast } from "sonner";
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle 
} from "@/components/ui/resizable";

interface ImageEditorProps {
  element: ScrapbookElement;
  onUpdate: (updatedElement: ScrapbookElement) => void;
}

export const ImageEditor = ({ element, onUpdate }: ImageEditorProps) => {
  const imageData = element.data as ImageElementData;
  const [previewSrc, setPreviewSrc] = useState(imageData.src);
  const [altText, setAltText] = useState(imageData.alt || "Scrapbook image");
  const [rotation, setRotation] = useState(imageData.rotation || 0);
  const [scale, setScale] = useState(100); // 100 = normal size
  const [naturalWidth, setNaturalWidth] = useState(0);
  const [naturalHeight, setNaturalHeight] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(4/3);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [activeTab, setActiveTab] = useState("transform"); // transform, filters
  const [initialTouchDistance, setInitialTouchDistance] = useState(0);
  const [initialScale, setInitialScale] = useState(100);
  const [initialRotation, setInitialRotation] = useState(0);
  const [touchStartAngle, setTouchStartAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If we have an image ref and a loaded image, get the natural dimensions
    if (imageRef.current && imageRef.current.complete && imageRef.current.naturalWidth) {
      updateImageDimensions(imageRef.current);
    }
  }, [previewSrc]);

  const updateImageDimensions = (img: HTMLImageElement) => {
    const { naturalWidth, naturalHeight } = img;
    setNaturalWidth(naturalWidth);
    setNaturalHeight(naturalHeight);
    setAspectRatio(naturalWidth / naturalHeight);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    updateImageDimensions(e.currentTarget);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setPreviewSrc(event.target.result);
        
        // Create a new image to get dimensions
        const img = new Image();
        img.onload = () => {
          updateImageDimensions(img);
        };
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle touch gestures for pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Get the distance between the two touch points
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialTouchDistance(distance);
      setInitialScale(scale);
      
      // Calculate initial angle for rotation
      const angle = Math.atan2(
        e.touches[1].clientY - e.touches[0].clientY,
        e.touches[1].clientX - e.touches[0].clientX
      ) * 180 / Math.PI;
      setTouchStartAngle(angle);
      setInitialRotation(rotation);
      
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 2) return;
    
    // Calculate new distance for scaling
    const distance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    
    // Calculate scale factor
    const scaleFactor = distance / initialTouchDistance;
    const newScale = Math.max(50, Math.min(200, initialScale * scaleFactor));
    setScale(newScale);
    
    // Calculate rotation angle
    const angle = Math.atan2(
      e.touches[1].clientY - e.touches[0].clientY,
      e.touches[1].clientX - e.touches[0].clientX
    ) * 180 / Math.PI;
    
    const angleDelta = angle - touchStartAngle;
    const newRotation = (initialRotation + angleDelta + 360) % 360;
    setRotation(newRotation);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleRotate = (direction: "left" | "right") => {
    const newRotation = direction === "left" 
      ? (rotation - 15 + 360) % 360 
      : (rotation + 15) % 360;
    setRotation(newRotation);
  };

  // Filter functions
  const getFilterStyle = () => {
    return {
      filter: `
        brightness(${brightness}%) 
        contrast(${contrast}%) 
        saturate(${saturation}%)
      `
    };
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  const handleSave = () => {
    const scaleMultiplier = scale / 100;
    
    // If we have natural dimensions, use them as the base
    let baseWidth, baseHeight;
    if (naturalWidth && naturalHeight) {
      // Limit the base size to reasonable dimensions
      const maxDimension = 800;
      if (naturalWidth > naturalHeight) {
        baseWidth = Math.min(naturalWidth, maxDimension);
        baseHeight = baseWidth / aspectRatio;
      } else {
        baseHeight = Math.min(naturalHeight, maxDimension);
        baseWidth = baseHeight * aspectRatio;
      }
    } else {
      // Use existing dimensions or defaults
      baseWidth = imageData.width || 200;
      baseHeight = imageData.height || 150;
    }
    
    const updatedElement = {
      ...element,
      data: {
        ...imageData,
        src: previewSrc,
        alt: altText,
        rotation: rotation,
        width: Math.max(50, Math.round(baseWidth * scaleMultiplier)),
        height: Math.max(50, Math.round(baseHeight * scaleMultiplier)),
        filters: {
          brightness,
          contrast,
          saturation
        }
      }
    };
    onUpdate(updatedElement);
    toast.success("Image updated");
  };

  return (
    <div className="space-y-4 py-2">
      <div className="bg-neutral-900/5 rounded-lg p-4">
        <div className="flex justify-center mb-4">
          <div 
            ref={previewContainerRef}
            className="relative w-full aspect-square max-h-56 bg-muted rounded-md overflow-hidden flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {previewSrc && previewSrc !== "/placeholder.svg" ? (
              <img 
                ref={imageRef}
                src={previewSrc} 
                alt={altText} 
                className="max-w-full max-h-full object-contain" 
                style={{
                  transform: `rotate(${rotation}deg) scale(${scale/100})`,
                  transformOrigin: 'center',
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                  ...getFilterStyle()
                }}
                onLoad={handleImageLoad}
                draggable={false}
              />
            ) : (
              <div className="text-center p-4">
                <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No image selected
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Instagram-like editing tabs */}
        <div className="flex justify-around border-b mb-3">
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'transform' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('transform')}
          >
            Transform
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'filters' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('filters')}
          >
            Filters
          </button>
        </div>

        {activeTab === 'transform' && (
          <>
            {/* Instagram-like editing controls */}
            <div className="flex justify-center gap-4 py-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRotate("left")}
                className="h-9 w-9 rounded-full"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRotate("right")}
                className="h-9 w-9 rounded-full"
              >
                <RotateCw className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => setScale(Math.min(scale + 10, 200))}
                className="h-9 w-9 rounded-full"
                disabled={scale >= 200}
              >
                <Maximize className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => setScale(Math.max(scale - 10, 50))}
                className="h-9 w-9 rounded-full"
                disabled={scale <= 50}
              >
                <Minimize className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-1">
              <Label htmlFor="scale-slider" className="text-xs text-muted-foreground">Scale ({scale}%)</Label>
              <Slider 
                id="scale-slider"
                min={50} 
                max={200} 
                step={5}
                value={[scale]}
                onValueChange={(values) => setScale(values[0])}
                className="py-2"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="rotation-slider" className="text-xs text-muted-foreground">Rotation ({rotation}°)</Label>
              <Slider 
                id="rotation-slider"
                min={0} 
                max={359} 
                step={15}
                value={[rotation]}
                onValueChange={(values) => setRotation(values[0])}
                className="py-2"
              />
            </div>
          </>
        )}

        {activeTab === 'filters' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="brightness-slider" className="text-xs text-muted-foreground">Brightness</Label>
                <Droplet className="h-4 w-4 text-muted-foreground" />
              </div>
              <Slider 
                id="brightness-slider"
                min={50} 
                max={150} 
                step={5}
                value={[brightness]}
                onValueChange={(values) => setBrightness(values[0])}
                className="py-2"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="contrast-slider" className="text-xs text-muted-foreground">Contrast</Label>
                <Contrast className="h-4 w-4 text-muted-foreground" />
              </div>
              <Slider 
                id="contrast-slider"
                min={50} 
                max={150} 
                step={5}
                value={[contrast]}
                onValueChange={(values) => setContrast(values[0])}
                className="py-2"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="saturation-slider" className="text-xs text-muted-foreground">Saturation</Label>
                <ImageFilter className="h-4 w-4 text-muted-foreground" />
              </div>
              <Slider 
                id="saturation-slider"
                min={0} 
                max={200} 
                step={5}
                value={[saturation]}
                onValueChange={(values) => setSaturation(values[0])}
                className="py-2"
              />
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetFilters}
              className="w-full mt-2"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2 pt-2">
        <Label htmlFor="upload-image">Upload Image</Label>
        <Input
          ref={fileInputRef}
          id="upload-image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="alt-text">Alternative Text</Label>
        <Input
          id="alt-text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Describe this image"
        />
      </div>

      <div className="pt-4">
        <Button onClick={handleSave} className="w-full">Save Changes</Button>
      </div>
    </div>
  );
};
