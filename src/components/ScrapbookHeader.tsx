
import { Button } from "@/components/ui/button";
import { PlusCircle, Book, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export const ScrapbookHeader = () => {
  return (
    <header className="w-full py-4 border-b bg-scrapbook-cream">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Book className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-handwritten text-primary">Canvas of Cherish</h1>
        </Link>
        
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
      </div>
    </header>
  );
};
