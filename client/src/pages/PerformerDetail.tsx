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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, Heart, Share2, Video, Eye, Star, SlidersHorizontal } from "lucide-react";
import type { Category, PaginatedVideos, Performer } from "@shared/schema";

type SortOption = "popular" | "newest" | "longest";

export default function PerformerDetail() {
  const { name } = useParams<{ name: string }>();
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [isFollowing, setIsFollowing] = useState(false);

  const performerName = decodeURIComponent(name || "");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: performers = [] } = useQuery<Performer[]>({
    queryKey: ["/api/performers"],
  });

  const { data: videosData, isLoading } = useQuery<PaginatedVideos>({
    queryKey: [`/api/videos/performer/${performerName}?page=${page}`],
  });

  const performer = performers.find(
    (p) => p.name.toLowerCase() === performerName.toLowerCase()
  );

  const videos = videosData?.videos || [];

  const sortedVideos = [...videos].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return 0;
      case "longest":
        return b.durationSeconds - a.durationSeconds;
      case "popular":
      default:
        return b.viewsCount - a.viewsCount;
    }
  });

  const totalViews = videos.reduce((acc, v) => acc + v.viewsCount, 0);
  const avgRating = 4.5;

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (videosData?.hasNext) setPage(page + 1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: performerName,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
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
        selectedCategory=""
        onCategorySelect={(cat) => cat && navigate(`/category/${encodeURIComponent(cat)}`)}
        favoritesCount={0}
      />

      <main className="flex-1 pt-20 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/performers")}
            className="mb-6"
            data-testid="button-back-performers"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Performers
          </Button>

          <div className="bg-gradient-to-r from-primary/10 via-background to-accent/10 rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background shadow-xl">
                <AvatarImage src="" alt={performerName} />
                <AvatarFallback className="text-4xl bg-primary/20">
                  {performerName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-performer-name">
                  {performerName}
                </h1>

                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    <span>{performer?.videoCount || videos.length} videos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{(totalViews / 1000000).toFixed(1)}M views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span>{avgRating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <Button
                    variant={isFollowing ? "secondary" : "default"}
                    onClick={() => setIsFollowing(!isFollowing)}
                    data-testid="button-follow"
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFollowing ? "fill-current" : ""}`} />
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button variant="outline" onClick={handleShare} data-testid="button-share">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold">Videos</h2>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[160px]" data-testid="select-sort">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="longest">Longest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
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
                <Video className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No videos found</h2>
              <p className="text-muted-foreground mb-6">
                There are no videos from this performer yet
              </p>
              <Button onClick={() => navigate("/performers")} variant="outline">
                Browse Performers
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

          {performers.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-4">Related Performers</h2>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {performers
                  .filter((p) => p.name !== performerName)
                  .slice(0, 8)
                  .map((p) => (
                    <button
                      key={p.id}
                      onClick={() => navigate(`/performer/${encodeURIComponent(p.name)}`)}
                      className="flex flex-col items-center gap-2 min-w-[100px] hover-elevate p-3 rounded-lg"
                      data-testid={`performer-card-${p.id}`}
                    >
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="bg-muted">
                          {p.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-center truncate w-full">
                        {p.name}
                      </span>
                    </button>
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
