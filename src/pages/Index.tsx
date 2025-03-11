
import { useState, useEffect } from "react";
import { ScrapbookHeader } from "@/components/ScrapbookHeader";
import { Button } from "@/components/ui/button";
import { Book, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { demoScrapbook } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleGetStarted = () => {
    navigate("/scrapbook");
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <ScrapbookHeader />
      
      <main className="flex-1 container py-12">
        <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-5xl font-handwritten text-primary mb-6">Canvas of Cherish</h1>
          <p className="text-xl mb-10 text-muted-foreground font-script">
            Create beautiful digital scrapbooks to preserve your cherished memories
          </p>
          
          <div className="bg-scrapbook-page p-8 rounded-lg shadow-page texture-paper mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-md shadow-element transform rotate-[-2deg]">
                <img
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400"
                  alt="Memories"
                  className="rounded mb-3 aspect-video object-cover"
                />
                <p className="font-script text-muted-foreground">Our adventure together</p>
              </div>
              
              <div className="bg-scrapbook-peach p-4 rounded-md shadow-element transform rotate-[1deg]">
                <div className="font-handwritten text-2xl text-primary mb-2">Summer Fun</div>
                <p className="font-script">The beach days we'll never forget. Sand between our toes and laughter in the air.</p>
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/6941/6941697.png"
                  alt="Sticker"
                  className="w-16 h-16 object-contain mt-2 mx-auto"
                />
              </div>
              
              <div className="bg-scrapbook-lavender p-4 rounded-md shadow-element transform rotate-[3deg]">
                <img
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400"
                  alt="Tech Memories"
                  className="rounded mb-3 aspect-video object-cover"
                />
                <p className="font-script text-sm">First coding project together - 2023</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="gap-2"
              onClick={handleGetStarted}
            >
              <Book className="h-5 w-5" />
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              asChild
            >
              <Link to="/scrapbook">
                <Plus className="h-5 w-5" />
                <span>View Demo Scrapbook</span>
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t bg-scrapbook-cream">
        <div className="container text-center">
          <p className="text-muted-foreground text-sm">Canvas of Cherish - Preserve your memories in beautiful digital scrapbooks</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
