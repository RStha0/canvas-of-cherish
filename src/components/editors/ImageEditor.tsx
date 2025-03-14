
import { useState, useRef } from "react";
import { ScrapbookElement, ImageElementData } from "@/types/scrapbook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ImagePlus, RotateCcw, RotateCw, Maximize, Minimize } from "lucide-react";
import { toast } from "sonner";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRotate = (direction: "left" | "right") => {
    const newRotation = direction === "left" 
      ? (rotation - 15 + 360) % 360 
      : (rotation + 15) % 360;
    setRotation(newRotation);
  };

  const handleSave = () => {
    const scaleMultiplier = scale / 100;
    const width = imageData.width || 200;
    const height = imageData.height || 150;
    
    const updatedElement = {
      ...element,
      data: {
        ...imageData,
        src: previewSrc,
        alt: altText,
        rotation: rotation,
        width: Math.max(50, Math.round(width * scaleMultiplier)),
        height: Math.max(50, Math.round(height * scaleMultiplier))
      }
    };
    onUpdate(updatedElement);
    toast.success("Image updated");
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex justify-center mb-4">
        <div className="relative w-full h-56 bg-muted rounded-md overflow-hidden flex items-center justify-center">
          {previewSrc && previewSrc !== "/placeholder.svg" ? (
            <img 
              src={previewSrc} 
              alt={altText} 
              className="w-full h-full object-contain" 
              style={{
                transform: `rotate(${rotation}deg) scale(${scale/100})`,
                transformOrigin: 'center',
                transition: 'transform 0.2s ease-out'
              }}
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
