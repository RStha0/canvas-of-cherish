
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ScrapbookNavigationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  onAddPage: () => void;
}

export const ScrapbookNavigation = ({
  currentPage,
  totalPages,
  onPageChange,
  onAddPage
}: ScrapbookNavigationProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between w-full py-4">
      <Button
        variant="outline"
        size={isMobile ? "icon" : "sm"}
        onClick={handlePrevious}
        disabled={currentPage <= 1}
        className={isMobile ? "rounded-full" : "gap-1"}
      >
        <ChevronLeft className="h-4 w-4" />
        {!isMobile && <span>Previous</span>}
      </Button>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {isMobile ? `${currentPage}/${totalPages}` : `Page ${currentPage} of ${totalPages}`}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={onAddPage}
          className="rounded-full h-8 w-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button
        variant="outline"
        size={isMobile ? "icon" : "sm"}
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        className={isMobile ? "rounded-full" : "gap-1"}
      >
        {!isMobile && <span>Next</span>}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
