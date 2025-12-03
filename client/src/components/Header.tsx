import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search, ArrowLeft, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

type SortOption = "default" | "views" | "date" | "duration";

interface HeaderProps {
  onMenuClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy?: SortOption;
  onSortChange?: (sort: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "views", label: "Most Views" },
  { value: "date", label: "Most Recent" },
  { value: "duration", label: "Longest" },
];

export function Header({ 
  onMenuClick, 
  searchQuery, 
  onSearchChange,
  sortBy = "default",
  onSortChange
}: HeaderProps) {
  const [location] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const showBackButton = location !== "/";

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 h-16 glass-dark"
      data-testid="header"
    >
      <div className="flex items-center justify-between h-full px-4 md:px-8 max-w-[1920px] mx-auto gap-4">
        {/* Left section - Back button or Logo */}
        <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
          {showBackButton ? (
            <Link href="/">
              <Button
                size="icon"
                variant="ghost"
                className="glass rounded-full"
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          ) : null}
          
          <Link href="/" className="flex items-center gap-2">
            <div 
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
              data-testid="logo-icon"
            >
              <span className="text-white font-bold text-lg font-['Poppins']">B</span>
            </div>
            <h1 
              className="text-xl md:text-2xl font-bold font-['Poppins'] gradient-text hidden sm:block"
              data-testid="logo-text"
            >
              Blueberry
            </h1>
          </Link>
        </div>

        {/* Center section - Search bar (hidden on mobile unless opened) */}
        <div className="flex-1 max-w-xl hidden md:flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 h-11 rounded-full glass border-white/10 focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/60"
              data-testid="input-search"
            />
            {searchQuery && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => onSearchChange("")}
                data-testid="button-clear-search"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Sort dropdown */}
          {onSortChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="glass rounded-full flex-shrink-0"
                  data-testid="button-sort"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-heavy">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onSortChange(option.value)}
                    className={sortBy === option.value ? "bg-primary/20 text-primary" : ""}
                    data-testid={`sort-option-${option.value}`}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Right section - Mobile search toggle + Menu */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Mobile search toggle */}
          <Button
            size="icon"
            variant="ghost"
            className="md:hidden glass rounded-full"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            data-testid="button-mobile-search"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Hamburger menu */}
          <Button
            size="icon"
            variant="ghost"
            className="glass rounded-full"
            onClick={onMenuClick}
            data-testid="button-menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile search bar overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-dark border-t border-white/5"
          >
            <div className="p-4 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-10 h-11 rounded-full glass border-white/10"
                  autoFocus
                  data-testid="input-mobile-search"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => {
                    onSearchChange("");
                    setIsSearchOpen(false);
                  }}
                  data-testid="button-close-mobile-search"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile sort */}
              {onSortChange && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="glass rounded-full flex-shrink-0"
                      data-testid="button-mobile-sort"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-heavy">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => onSortChange(option.value)}
                        className={sortBy === option.value ? "bg-primary/20 text-primary" : ""}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
