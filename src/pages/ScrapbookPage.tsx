
import { useState, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ScrapbookHeader } from "@/components/ScrapbookHeader";
import { ScrapbookPageCanvas } from "@/components/ScrapbookPageCanvas";
import { ElementToolbar } from "@/components/ElementToolbar";
import { MobileElementToolbar } from "@/components/MobileElementToolbar";
import { ScrapbookNavigation } from "@/components/ScrapbookNavigation";
import { ElementEditor } from "@/components/ElementEditor";
import { ScrapbookElement, ElementType, ScrapbookPage as ScrapbookPageType } from "@/types/scrapbook";
import { demoScrapbook } from "@/data/mockData";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-media-query";

const ScrapbookPage = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [scrapbook, setScrapbook] = useState(demoScrapbook);
  const [currentEditingElement, setCurrentEditingElement] = useState<ScrapbookElement | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const currentPage = scrapbook.pages[currentPageIndex];
  const canvasRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleElementsChange = (newElements: ScrapbookElement[]) => {
    const updatedPages = [...scrapbook.pages];
    updatedPages[currentPageIndex] = {
      ...currentPage,
      elements: newElements,
      updatedAt: new Date()
    };
    
    setScrapbook({
      ...scrapbook,
      pages: updatedPages,
      updatedAt: new Date()
    });
  };

  const handleElementUpdate = (updatedElement: ScrapbookElement) => {
    const updatedElements = currentPage.elements.map(el => 
      el.id === updatedElement.id ? updatedElement : el
    );
    
    handleElementsChange(updatedElements);
    setIsEditorOpen(false);
    setCurrentEditingElement(null);
  };

  const handleElementRemove = (elementId: string) => {
    const updatedElements = currentPage.elements.filter(el => el.id !== elementId);
    handleElementsChange(updatedElements);
    setIsEditorOpen(false);
    setCurrentEditingElement(null);
    toast.success("Element removed");
  };

  const handleEditElement = (element: ScrapbookElement) => {
    setCurrentEditingElement(element);
    setIsEditorOpen(true);
  };

  const handleAddElement = (elementType: ElementType) => {
    // For mobile, center the new element in the visible area of the canvas
    let centerX = 200;
    let centerY = 200;
    
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      centerX = rect.width / 2;
      centerY = rect.height / 2;
    }
    
    let newElement: ScrapbookElement;
    
    switch (elementType) {
      case ElementType.TEXT:
        newElement = {
          id: uuidv4(),
          type: ElementType.TEXT,
          x: centerX,
          y: centerY,
          zIndex: Math.max(0, ...currentPage.elements.map(e => e.zIndex)) + 1,
          data: {
            content: "Double click to edit text",
            fontFamily: "Dancing Script, cursive",
            fontSize: 18,
            color: "#444444",
          }
        };
        break;
        
      case ElementType.IMAGE:
        newElement = {
          id: uuidv4(),
          type: ElementType.IMAGE,
          x: centerX,
          y: centerY,
          zIndex: Math.max(0, ...currentPage.elements.map(e => e.zIndex)) + 1,
          data: {
            src: "/placeholder.svg",
            alt: "Placeholder image",
            width: 200,
            height: 150,
            rotation: 0
          }
        };
        break;
        
      case ElementType.STICKER:
        newElement = {
          id: uuidv4(),
          type: ElementType.STICKER,
          x: centerX,
          y: centerY,
          zIndex: Math.max(0, ...currentPage.elements.map(e => e.zIndex)) + 1,
          data: {
            src: "https://cdn-icons-png.flaticon.com/512/6010/6010051.png",
            alt: "Heart sticker",
            width: 80,
            height: 80,
            rotation: 0
          }
        };
        break;
        
      default:
        return;
    }
    
    handleElementsChange([...currentPage.elements, newElement]);
    
    // Open the editor immediately for new elements
    setTimeout(() => {
      handleEditElement(newElement);
    }, 100);
  };

  const handleChangeBackground = (background: string) => {
    const updatedPages = [...scrapbook.pages];
    updatedPages[currentPageIndex] = {
      ...currentPage,
      background,
      updatedAt: new Date()
    };
    
    setScrapbook({
      ...scrapbook,
      pages: updatedPages,
      updatedAt: new Date()
    });
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPageIndex(pageNumber - 1);
  };

  const handleAddPage = () => {
    const newPageIndex = scrapbook.pages.length;
    const newPage: ScrapbookPageType = {
      id: uuidv4(),
      title: `Page ${newPageIndex + 1}`,
      background: 'bg-scrapbook-page texture-paper',
      elements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setScrapbook({
      ...scrapbook,
      pages: [...scrapbook.pages, newPage],
      updatedAt: new Date()
    });
    
    setCurrentPageIndex(newPageIndex);
    toast.success("New page added");
  };

  const handleSave = () => {
    // In a real app, this would save to a database or local storage
    toast.success("Scrapbook saved successfully!");
  };

  const handleShare = () => {
    // In a real app, this would generate a snapshot and open share options
    toast.success("Ready to share your scrapbook page!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <ScrapbookHeader />
      
      <main className="flex-1 flex flex-col h-[calc(100vh-64px)]">
        <div 
          ref={canvasRef} 
          className="flex-grow flex justify-center items-center p-2 sm:p-4 overflow-hidden"
        >
          <div className={`w-full h-full max-h-full ${isMobile ? 'aspect-square' : ''}`}>
            <ScrapbookPageCanvas 
              elements={currentPage.elements}
              onElementsChange={handleElementsChange}
              background={currentPage.background}
              onEditElement={handleEditElement}
            />
          </div>
        </div>
        
        {!isMobile && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 bg-background border-t">
            <div className="lg:col-span-3">
              <ScrapbookNavigation 
                currentPage={currentPageIndex + 1}
                totalPages={scrapbook.pages.length}
                onPageChange={handlePageChange}
                onAddPage={handleAddPage}
              />
            </div>
            <div className="lg:col-span-1">
              <ElementToolbar 
                onAddElement={handleAddElement}
                onChangeBackground={handleChangeBackground}
                onSave={handleSave}
              />
            </div>
          </div>
        )}
        
        {isMobile && (
          <div className="p-2 bg-background border-t">
            <ScrapbookNavigation 
              currentPage={currentPageIndex + 1}
              totalPages={scrapbook.pages.length}
              onPageChange={handlePageChange}
              onAddPage={handleAddPage}
            />
            <MobileElementToolbar
              onAddElement={handleAddElement}
              onChangeBackground={handleChangeBackground}
              onSave={handleSave}
              onShare={handleShare}
            />
          </div>
        )}
      </main>

      <ElementEditor 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        element={currentEditingElement}
        onElementUpdate={handleElementUpdate}
        onElementRemove={handleElementRemove}
      />
    </div>
  );
};

export default ScrapbookPage;
