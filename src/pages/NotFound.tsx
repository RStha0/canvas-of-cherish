
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-scrapbook-page texture-paper p-6">
      <div className="text-center">
        <h1 className="text-8xl font-handwritten text-primary mb-4">404</h1>
        <p className="text-2xl font-script text-muted-foreground mb-8">
          Oops! This page seems to have slipped out of our scrapbook
        </p>
        <Button asChild>
          <Link to="/" className="gap-2">
            <Home className="h-5 w-5" />
            <span>Return to Home</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
