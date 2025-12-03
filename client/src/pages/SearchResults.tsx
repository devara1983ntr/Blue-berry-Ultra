import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Header } from "@/components/Header";
import { SideDrawer } from "@/components/SideDrawer";
import { VideoGrid } from "@/components/VideoGrid";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, ArrowLeft, SlidersHorizontal, X, Filter
} from "lucide-react";
import type { Category, PaginatedVideos } from "@shared/schema";

type SortOption = 'relevance' | 'views' | 'rating' | 'duration' | 'newest';

export default function SearchResults() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const searchParams = useSearch();
  const query = new URLSearchParams(searchParams).get('q') || '';
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minDuration, setMinDuration] = useState<number | null>(null);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const searchQueryParam = query ? `?search=${encodeURIComponent(query)}` : '';
  
  const { data: searchData, isLoading } = useQuery<PaginatedVideos>({
    queryKey: [`/api/videos${searchQueryParam}&page=1`],
    enabled: !!query,
  });

  const videos = searchData?.videos || [];

  const filteredAndSortedVideos = useMemo(() => {
    let result = [...videos];

    if (selectedCategory) {
      result = result.filter(v => 
        v.categories.some(c => c.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    if (minDuration !== null) {
      result = result.filter(v => (v.durationSeconds || 0) >= minDuration);
    }

    switch (sortBy) {
      case 'views':
        result.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'duration':
        result.sort((a, b) => (b.durationSeconds || 0) - (a.durationSeconds || 0));
        break;
      case 'newest':
        break;
      default:
        break;
    }

    return result;
  }, [videos, sortBy, selectedCategory, minDuration]);

  const handleSearch = (newQuery: string) => {
    setSearchQuery(newQuery);
    if (newQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(newQuery.trim())}`);
    }
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setMinDuration(null);
    setSortBy('relevance');
  };

  const hasActiveFilters = selectedCategory !== null || minDuration !== null || sortBy !== 'relevance';

  const durationFilters = [
    { label: 'Any', value: null },
    { label: '< 5 min', value: 0 },
    { label: '5-20 min', value: 300 },
    { label: '20+ min', value: 1200 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        onMenuClick={() => setIsDrawerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
      />

      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        categories={categories}
        selectedCategory={null}
        onCategorySelect={() => {}}
        favoritesCount={0}
      />

      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3" data-testid="text-search-title">
                <Search className="w-8 h-8 text-primary" />
                Search Results
              </h1>
              {query && (
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredAndSortedVideos.length} results for "{query}"
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[150px]" data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="duration">Longest</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={selectedCategory || 'all'} 
              onValueChange={(v) => setSelectedCategory(v === 'all' ? null : v)}
            >
              <SelectTrigger className="w-[150px]" data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.slice(0, 20).map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              {durationFilters.map((filter) => (
                <Badge
                  key={filter.label}
                  variant={minDuration === filter.value ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setMinDuration(filter.value)}
                  data-testid={`badge-duration-${filter.label.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {filter.label}
                </Badge>
              ))}
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-destructive"
                data-testid="button-clear-filters"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {!query ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Start searching</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Enter a search term to find videos by title, category, or tags
              </p>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="aspect-video rounded-xl" />
              ))}
            </div>
          ) : filteredAndSortedVideos.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Filter className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No results found</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                Try adjusting your search or filters to find what you're looking for
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            <VideoGrid
              title=""
              videos={filteredAndSortedVideos}
              sectionId="search-results"
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
