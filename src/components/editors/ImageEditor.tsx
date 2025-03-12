
import { useState, useRef } from "react";
import { ScrapbookElement, ImageElementData } from "@/types/scrapbook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";

interface ImageEditorProps {
  element: ScrapbookElement;
  onUpdate: (updatedElement: ScrapbookElement) => void;
}

export const ImageEditor = ({ element, onUpdate }: ImageEditorProps) => {
  const imageData = element.data as ImageElementData;
  const [previewSrc, setPreviewSrc] = useState(imageData.src);
  const [altText, setAltText] = useState(imageData.alt || "Scrapbook image");
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

  const handleSave = () => {
    const updatedElement = {
      ...element,
      data: {
        ...imageData,
        src: previewSrc,
        alt: altText
      }
    };
    onUpdate(updatedElement);
    toast.success("Image updated");
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-center mb-4">
        <div className="relative w-full h-48 bg-muted rounded-md overflow-hidden flex items-center justify-center">
          {previewSrc && previewSrc !== "/placeholder.svg" ? (
            <img 
              src={previewSrc} 
              alt={altText} 
              className="w-full h-full object-contain" 
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

      <div className="space-y-2">
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
