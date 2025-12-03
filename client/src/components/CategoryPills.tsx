import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CategoryPillsProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export function CategoryPills({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: CategoryPillsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const allCategories = ["All", ...categories];

  return (
    <div className="relative py-4" data-testid="category-pills">
      {/* Left scroll button */}
      {showLeftArrow && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-background via-background to-transparent pr-8">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => scroll("left")}
            className="rounded-full glass"
            data-testid="button-scroll-left"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Scrollable pills container */}
      <div
        ref={scrollRef}
        onScroll={checkScrollButtons}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-4 md:px-8"
        data-testid="category-pills-scroll"
      >
        {allCategories.map((category) => {
          const isSelected = 
            (category === "All" && selectedCategory === null) ||
            category === selectedCategory;

          return (
            <Badge
              key={category}
              variant={isSelected ? "default" : "outline"}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-150 ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "glass hover:bg-white/10"
              }`}
              onClick={() => onCategorySelect(category === "All" ? null : category)}
              data-testid={`category-pill-${category.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {category}
            </Badge>
          );
        })}
      </div>

      {/* Right scroll button */}
      {showRightArrow && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-background via-background to-transparent pl-8">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => scroll("right")}
            className="rounded-full glass"
            data-testid="button-scroll-right"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
