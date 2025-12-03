import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { SideDrawer } from "@/components/SideDrawer";
import { HeroSection } from "@/components/HeroSection";
import { CategoryPills } from "@/components/CategoryPills";
import { VideoGrid } from "@/components/VideoGrid";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/context/LanguageContext";
import { usePlayback } from "@/context/PlaybackContext";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Play, Clock, History } from "lucide-react";
import type { PaginatedVideos, Category } from "@shared/schema";

type SortOption = "default" | "views" | "date" | "duration";

export default function Home() {
  const { t } = useLanguage();
  const { continueWatching, recentlyWatched } = usePlayback();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [currentPage, setCurrentPage] = useState(1);

  const buildQueryKey = () => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategory) params.set("category", selectedCategory);
    return `/api/videos?${params.toString()}`;
  };

  const { data: videosData, isLoading: isLoadingVideos } = useQuery<PaginatedVideos>({
    queryKey: [buildQueryKey()],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const categoryNames = useMemo(() => 
    categories.map(c => c.name),
    [categories]
  );

  const videos = videosData?.videos || [];
  const totalPages = videosData?.totalPages || 1;
  const hasNext = videosData?.hasNext || false;
  const hasPrevious = videosData?.hasPrevious || false;

  const sortedVideos = useMemo(() => {
    const sorted = [...videos];
    switch (sortBy) {
      case "views":
        return sorted.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
      case "duration":
        return sorted.sort((a, b) => (b.durationSeconds || 0) - (a.durationSeconds || 0));
      default:
        return sorted;
    }
  }, [videos, sortBy]);

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showFilteredResults = searchQuery.trim() || selectedCategory;

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 py-8" data-testid="pagination-controls">
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(1)}
          disabled={!hasPrevious}
          data-testid="button-first-page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(currentPage - 1)}
          disabled={!hasPrevious}
          data-testid="button-prev-page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-1">
          {startPage > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(1)}
                data-testid="button-page-1"
              >
                1
              </Button>
              {startPage > 2 && <span className="px-2 text-muted-foreground">...</span>}
            </>
          )}

          {pageNumbers.map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "ghost"}
              size="sm"
              onClick={() => goToPage(page)}
              data-testid={`button-page-${page}`}
            >
              {page}
            </Button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2 text-muted-foreground">...</span>}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(totalPages)}
                data-testid={`button-page-${totalPages}`}
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(currentPage + 1)}
          disabled={!hasNext}
          data-testid="button-next-page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(totalPages)}
          disabled={!hasNext}
          data-testid="button-last-page"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>

        <span className="ml-4 text-sm text-muted-foreground" data-testid="text-page-info">
          {t.common.page} {currentPage} {t.common.of} {totalPages}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        onMenuClick={() => setIsDrawerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        favoritesCount={0}
      />

      <main className="flex-1 pt-16">
        {!showFilteredResults && <HeroSection />}

        <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-lg border-b border-white/5">
          <div className="max-w-[1920px] mx-auto">
            <CategoryPills
              categories={categoryNames}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          </div>
        </div>

        <div className="max-w-[1920px] mx-auto" id="videos">
          {continueWatching.length > 0 && !showFilteredResults && (
            <div className="px-4 md:px-8 py-6 border-b border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2" data-testid="text-continue-watching-title">
                  <Play className="w-5 h-5 text-primary" />
                  Continue Watching
                </h2>
                <Link href="/history">
                  <Button variant="ghost" size="sm" data-testid="button-view-all-continue">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {continueWatching.slice(0, 5).map((item) => (
                  <Link key={item.videoId} href={`/video/${item.videoId}`}>
                    <Card 
                      className="group overflow-hidden hover-elevate cursor-pointer"
                      data-testid={`card-continue-${item.videoId}`}
                    >
                      <div className="relative aspect-video">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <Progress value={item.progress} className="h-1 mb-2" />
                          <p className="text-sm font-medium text-white line-clamp-2">{item.title}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-white/70">
                            <Clock className="w-3 h-3" />
                            <span>{Math.round(item.progress)}% watched</span>
                          </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                            <Play className="w-6 h-6 text-primary-foreground fill-current" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {recentlyWatched.length > 0 && !showFilteredResults && (
            <div className="px-4 md:px-8 py-6 border-b border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2" data-testid="text-recently-watched-title">
                  <History className="w-5 h-5 text-muted-foreground" />
                  Recently Watched
                </h2>
                <Link href="/history">
                  <Button variant="ghost" size="sm" data-testid="button-view-all-recent">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {recentlyWatched.slice(0, 5).map((item) => (
                  <Link key={item.videoId} href={`/video/${item.videoId}`}>
                    <Card 
                      className="group overflow-hidden hover-elevate cursor-pointer"
                      data-testid={`card-recent-${item.videoId}`}
                    >
                      <div className="relative aspect-video">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-sm font-medium text-white line-clamp-2">{item.title}</p>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                            <Play className="w-6 h-6 text-primary-foreground fill-current" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {isLoadingVideos ? (
            <div className="px-4 md:px-8 py-6">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="aspect-video rounded-lg" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <VideoGrid
                title={
                  searchQuery
                    ? `${t.common.search}: "${searchQuery}"`
                    : selectedCategory
                    ? `${selectedCategory} ${t.common.videos}`
                    : t.common.videos
                }
                videos={sortedVideos}
                isLoading={isLoadingVideos}
                emptyMessage={
                  searchQuery
                    ? `${t.common.noResults} "${searchQuery}"`
                    : selectedCategory
                    ? `${t.common.noResults} ${selectedCategory}`
                    : t.common.noResults
                }
                sectionId="main"
              />
              {renderPagination()}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
