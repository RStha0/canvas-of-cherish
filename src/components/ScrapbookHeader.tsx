
import { Button } from "@/components/ui/button";
import { PlusCircle, Book, Settings, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const ScrapbookHeader = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <header className="w-full py-3 md:py-4 border-b bg-scrapbook-cream">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Book className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          <h1 className="text-xl md:text-2xl font-handwritten text-primary">Canvas of Cherish</h1>
        </Link>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 pt-8">
                <h2 className="text-lg font-handwritten">Scrapbook Menu</h2>
                <div className="space-y-2">
                  <Button variant="outline" size="lg" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                  <Button size="lg" className="w-full justify-start gap-2">
                    <PlusCircle className="h-4 w-4" />
                    New Scrapbook
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
            <Button className="gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>New Scrapbook</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
