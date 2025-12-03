import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { SideDrawer } from "@/components/SideDrawer";
import { VideoGrid } from "@/components/VideoGrid";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, ArrowLeft, Clock, Eye, ThumbsUp, 
  Flame, Calendar, Star
} from "lucide-react";
import type { Category, PaginatedVideos } from "@shared/schema";

type TrendingPeriod = 'today' | 'week' | 'month' | 'all';

export default function Trending() {
  const { t } = useLanguage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [period, setPeriod] = useState<TrendingPeriod>('today');

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: videosData, isLoading } = useQuery<PaginatedVideos>({
    queryKey: ["/api/videos?page=1"],
  });

  const videos = videosData?.videos || [];
  
  const trendingVideos = [...videos]
    .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
    .slice(0, 24);

  const topRatedVideos = [...videos]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 24);

  const newestVideos = [...videos].slice(0, 24);

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
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3" data-testid="text-trending-title">
                <TrendingUp className="w-8 h-8 text-primary" />
                Trending
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Discover what's popular right now
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge
              variant={period === 'today' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setPeriod('today')}
              data-testid="badge-today"
            >
              <Clock className="w-3 h-3 mr-1" />
              Today
            </Badge>
            <Badge
              variant={period === 'week' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setPeriod('week')}
              data-testid="badge-week"
            >
              <Calendar className="w-3 h-3 mr-1" />
              This Week
            </Badge>
            <Badge
              variant={period === 'month' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setPeriod('month')}
              data-testid="badge-month"
            >
              <Calendar className="w-3 h-3 mr-1" />
              This Month
            </Badge>
            <Badge
              variant={period === 'all' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setPeriod('all')}
              data-testid="badge-all"
            >
              <Star className="w-3 h-3 mr-1" />
              All Time
            </Badge>
          </div>

          <Tabs defaultValue="views" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="views" className="gap-2" data-testid="tab-views">
                <Eye className="w-4 h-4" />
                Most Viewed
              </TabsTrigger>
              <TabsTrigger value="rated" className="gap-2" data-testid="tab-rated">
                <ThumbsUp className="w-4 h-4" />
                Top Rated
              </TabsTrigger>
              <TabsTrigger value="newest" className="gap-2" data-testid="tab-newest">
                <Flame className="w-4 h-4" />
                Newest
              </TabsTrigger>
            </TabsList>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-video rounded-xl" />
                ))}
              </div>
            ) : (
              <>
                <TabsContent value="views">
                  <VideoGrid
                    title=""
                    videos={trendingVideos}
                    sectionId="trending-views"
                  />
                </TabsContent>

                <TabsContent value="rated">
                  <VideoGrid
                    title=""
                    videos={topRatedVideos}
                    sectionId="trending-rated"
                  />
                </TabsContent>

                <TabsContent value="newest">
                  <VideoGrid
                    title=""
                    videos={newestVideos}
                    sectionId="trending-newest"
                  />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
