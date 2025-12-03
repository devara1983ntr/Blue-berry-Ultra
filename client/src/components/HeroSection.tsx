import { Play, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function HeroSection() {
  return (
    <section 
      className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-background" />
      
      {/* Floating geometric shapes for premium feel */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "5s", animationDelay: "1s" }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"
        />
      </div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px"
        }}
      />
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 py-12 max-w-3xl mx-auto">
        <div 
          className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6"
          data-testid="hero-badge"
        >
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground/80">Premium Adult Entertainment</span>
        </div>
        
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold font-['Poppins'] mb-4"
          data-testid="hero-title"
        >
          <span className="gradient-text">Blueberry</span>
        </h1>
        
        <p 
          className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto"
          data-testid="hero-subtitle"
        >
          Discover premium adult content with our elegant, modern streaming experience
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/#trending">
            <Button 
              size="lg" 
              className="rounded-full px-8 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0"
              data-testid="button-explore"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Exploring</span>
            </Button>
          </Link>
          
          <Link href="/?filter=trending">
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full px-8 glass border-white/10 backdrop-blur-md"
              data-testid="button-trending"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              <span>View Trending</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
