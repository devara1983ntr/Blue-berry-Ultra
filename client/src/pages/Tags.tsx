import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Header } from "@/components/Header";
import { SideDrawer } from "@/components/SideDrawer";
import { VideoGrid } from "@/components/VideoGrid";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Tag, ArrowLeft, Search, TrendingUp, Hash
} from "lucide-react";
import type { Category, Tag as TagType, PaginatedVideos } from "@shared/schema";

export default function Tags() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const searchParams = useSearch();
  const selectedTag = new URLSearchParams(searchParams).get('q');
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: tags = [], isLoading: isLoadingTags } = useQuery<TagType[]>({
    queryKey: ["/api/tags"],
  });

  const tagQueryParam = selectedTag ? `?tag=${encodeURIComponent(selectedTag)}` : '';
  
  const { data: videosData, isLoading: isLoadingVideos } = useQuery<PaginatedVideos>({
    queryKey: [`/api/videos${tagQueryParam}&page=1`],
    enabled: !!selectedTag,
  });

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleTagClick = (tagName: string) => {
    navigate(`/tags?q=${encodeURIComponent(tagName)}`);
  };

  const videos = videosData?.videos || [];

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
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3" data-testid="text-tags-title">
                <Hash className="w-8 h-8 text-primary" />
                {selectedTag ? `#${selectedTag}` : 'Tags'}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedTag 
                  ? `${videos.length} videos with this tag`
                  : `Browse ${tags.length} popular tags`
                }
              </p>
            </div>
            {selectedTag && (
              <Button
                variant="outline"
                onClick={() => navigate('/tags')}
                data-testid="button-all-tags"
              >
                All Tags
              </Button>
            )}
          </div>

          {!selectedTag && (
            <>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tags..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-tags"
                />
              </div>

              {isLoadingTags ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-24 rounded-full" />
                  ))}
                </div>
              ) : filteredTags.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Tag className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No tags found</h3>
                  <p className="text-muted-foreground">
                    Try a different search term
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filteredTags.map((tag, index) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="cursor-pointer text-sm py-2 px-4 hover-elevate"
                      onClick={() => handleTagClick(tag.name)}
                      data-testid={`tag-${tag.id}`}
                    >
                      <Hash className="w-3 h-3 mr-1" />
                      {tag.name}
                      <span className="ml-2 text-muted-foreground">
                        {tag.count.toLocaleString()}
                      </span>
                      {index < 5 && (
                        <TrendingUp className="w-3 h-3 ml-2 text-primary" />
                      )}
                    </Badge>
                  ))}
                </div>
              )}
            </>
          )}

          {selectedTag && (
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
                    <Tag className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">No videos found</h2>
                  <p className="text-muted-foreground mb-4">
                    No videos with this tag yet
                  </p>
                  <Button onClick={() => navigate('/tags')} variant="outline">
                    Browse All Tags
                  </Button>
                </div>
              ) : (
                <VideoGrid
                  title=""
                  videos={videos}
                  sectionId="tag-videos"
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
