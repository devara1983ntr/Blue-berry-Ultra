import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Header } from "@/components/Header";
import { SideDrawer } from "@/components/SideDrawer";
import { VideoGrid } from "@/components/VideoGrid";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, ArrowLeft, Search, TrendingUp, Video, Grid3X3, List
} from "lucide-react";
import type { Category, Performer, PaginatedVideos } from "@shared/schema";

export default function Performers() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const searchParams = useSearch();
  const selectedPerformer = new URLSearchParams(searchParams).get('q');
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: performers = [], isLoading: isLoadingPerformers } = useQuery<Performer[]>({
    queryKey: ["/api/performers"],
  });

  const performerQueryParam = selectedPerformer ? `?performer=${encodeURIComponent(selectedPerformer)}` : '';
  
  const { data: videosData, isLoading: isLoadingVideos } = useQuery<PaginatedVideos>({
    queryKey: [`/api/videos${performerQueryParam}&page=1`],
    enabled: !!selectedPerformer,
  });

  const filteredPerformers = performers.filter(p =>
    p.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const sortedPerformers = [...filteredPerformers].sort((a, b) => b.videoCount - a.videoCount);

  const handlePerformerClick = (performerName: string) => {
    navigate(`/performers?q=${encodeURIComponent(performerName)}`);
  };

  const videos = videosData?.videos || [];

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1 
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-500/20 text-red-500',
      'bg-blue-500/20 text-blue-500',
      'bg-green-500/20 text-green-500',
      'bg-purple-500/20 text-purple-500',
      'bg-orange-500/20 text-orange-500',
      'bg-pink-500/20 text-pink-500',
      'bg-cyan-500/20 text-cyan-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
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
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3" data-testid="text-performers-title">
                <Users className="w-8 h-8 text-primary" />
                {selectedPerformer || 'Performers'}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedPerformer 
                  ? `${videos.length} videos`
                  : `Browse ${performers.length} performers`
                }
              </p>
            </div>
            {selectedPerformer && (
              <Button
                variant="outline"
                onClick={() => navigate('/performers')}
                data-testid="button-all-performers"
              >
                All Performers
              </Button>
            )}
          </div>

          {!selectedPerformer && (
            <>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search performers..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-performers"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    data-testid="button-view-grid"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    data-testid="button-view-list"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {isLoadingPerformers ? (
                <div className={viewMode === 'grid'
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                  : "space-y-2"
                }>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <Skeleton key={i} className={viewMode === 'grid' ? "h-40 rounded-xl" : "h-16 rounded-lg"} />
                  ))}
                </div>
              ) : filteredPerformers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No performers found</h3>
                  <p className="text-muted-foreground">
                    Try a different search term
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {sortedPerformers.map((performer, index) => (
                    <Card
                      key={performer.id}
                      className="p-4 cursor-pointer hover-elevate transition-all group"
                      onClick={() => handlePerformerClick(performer.name)}
                      data-testid={`performer-card-${performer.id}`}
                    >
                      <div className="flex flex-col items-center text-center gap-3">
                        <Avatar className={`w-16 h-16 ${getAvatarColor(performer.name)}`}>
                          <AvatarFallback className="text-lg font-semibold">
                            {getInitials(performer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-sm line-clamp-1">{performer.name}</h3>
                          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
                            <Video className="w-3 h-3" />
                            <span>{performer.videoCount} videos</span>
                          </div>
                        </div>
                        {index < 3 && (
                          <Badge variant="secondary" className="text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedPerformers.map((performer, index) => (
                    <Card
                      key={performer.id}
                      className="p-4 cursor-pointer hover-elevate transition-all"
                      onClick={() => handlePerformerClick(performer.name)}
                      data-testid={`performer-list-${performer.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className={`w-12 h-12 ${getAvatarColor(performer.name)}`}>
                          <AvatarFallback className="font-semibold">
                            {getInitials(performer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium">{performer.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Video className="w-3 h-3" />
                            <span>{performer.videoCount} videos</span>
                          </div>
                        </div>
                        {index < 5 && (
                          <Badge variant="secondary">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {selectedPerformer && (
            <>
              {isLoadingVideos ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-video rounded-xl" />
                  ))}
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Users className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">No videos found</h2>
                  <p className="text-muted-foreground mb-4">
                    No videos with this performer yet
                  </p>
                  <Button onClick={() => navigate('/performers')} variant="outline">
                    Browse All Performers
                  </Button>
                </div>
              ) : (
                <VideoGrid
                  title=""
                  videos={videos}
                  sectionId="performer-videos"
                />
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
