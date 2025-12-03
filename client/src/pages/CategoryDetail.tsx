import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SideDrawer } from "@/components/SideDrawer";
import { VideoGrid } from "@/components/VideoGrid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, Filter, Grid, LayoutGrid, SlidersHorizontal } from "lucide-react";
import type { Category, PaginatedVideos } from "@shared/schema";

type SortOption = "popular" | "newest" | "longest" | "shortest";
type ViewMode = "grid" | "large";

export default function CategoryDetail() {
  const { name } = useParams<{ name: string }>();
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const categoryName = decodeURIComponent(name || "");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: videosData, isLoading } = useQuery<PaginatedVideos>({
    queryKey: [`/api/videos/category/${categoryName}?page=${page}`],
  });

  const currentCategory = categories.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  );

  const videos = videosData?.videos || [];

  const sortedVideos = [...videos].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return 0;
      case "longest":
        return b.durationSeconds - a.durationSeconds;
      case "shortest":
        return a.durationSeconds - b.durationSeconds;
      case "popular":
      default:
        return b.viewsCount - a.viewsCount;
    }
  });

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (videosData?.hasNext) setPage(page + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        onMenuClick={() => setIsDrawerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        categories={categories}
        selectedCategory={categoryName || ""}
        onCategorySelect={(cat) => cat && navigate(`/category/${encodeURIComponent(cat)}`)}
        favoritesCount={0}
      />

      <main className="flex-1 pt-20 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/categories")}
              className="mb-4"
              data-testid="button-back-categories"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Categories
            </Button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold" data-testid="text-category-title">
                  {categoryName}
                </h1>
                {currentCategory && (
                  <p className="text-muted-foreground mt-1">
                    {currentCategory.count.toLocaleString()} videos
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-[160px]" data-testid="select-sort">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="longest">Longest</SelectItem>
                    <SelectItem value="shortest">Shortest</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex bg-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    data-testid="button-view-grid"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "large" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("large")}
                    data-testid="button-view-large"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-video rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : sortedVideos.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Filter className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No videos found</h2>
              <p className="text-muted-foreground mb-6">
                There are no videos in this category yet
              </p>
              <Button onClick={() => navigate("/categories")} variant="outline">
                Browse Categories
              </Button>
            </div>
          ) : (
            <>
              <VideoGrid videos={sortedVideos} />

              {videosData && videosData.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    data-testid="button-prev-page"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {videosData.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={!videosData.hasNext}
                    data-testid="button-next-page"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}

          {categories.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-4">Related Categories</h2>
              <div className="flex flex-wrap gap-2">
                {categories
                  .filter((c) => c.name !== categoryName)
                  .slice(0, 12)
                  .map((cat) => (
                    <Badge
                      key={cat.id}
                      variant="secondary"
                      className="cursor-pointer hover-elevate px-4 py-2"
                      onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
                      data-testid={`badge-category-${cat.id}`}
                    >
                      {cat.name}
                      <span className="ml-2 text-muted-foreground">({cat.count})</span>
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
