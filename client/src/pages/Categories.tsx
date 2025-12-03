import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Header } from "@/components/Header";
import { SideDrawer } from "@/components/SideDrawer";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Grid3X3, List, Search, ArrowLeft, TrendingUp,
  Folder, Star, Heart, Flame, Users, Video
} from "lucide-react";
import type { Category } from "@shared/schema";

const categoryIcons: Record<string, any> = {
  'star': Star,
  'heart': Heart,
  'flame': Flame,
  'users': Users,
  'video': Video,
  'folder': Folder,
};

export default function Categories() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => b.count - a.count);

  const handleCategoryClick = (categoryName: string | null) => {
    if (categoryName) {
      navigate(`/?category=${encodeURIComponent(categoryName)}`);
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = categoryIcons[iconName] || Folder;
    return <Icon className="w-6 h-6" />;
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
        onCategorySelect={handleCategoryClick}
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
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3" data-testid="text-categories-title">
                <Grid3X3 className="w-8 h-8 text-primary" />
                {t.common.categories}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Browse {categories.length} categories
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-categories"
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

          {isLoading ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              : "space-y-2"
            }>
              {Array.from({ length: 20 }).map((_, i) => (
                <Skeleton key={i} className={viewMode === 'grid' ? "h-32 rounded-xl" : "h-16 rounded-lg"} />
              ))}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {sortedCategories.map((category, index) => (
                <Card
                  key={category.id}
                  className="p-4 cursor-pointer hover-elevate transition-all group"
                  onClick={() => handleCategoryClick(category.name)}
                  data-testid={`category-card-${category.id}`}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      {getIcon(category.icon)}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm line-clamp-1">{category.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {category.count.toLocaleString()} videos
                      </p>
                    </div>
                    {index < 3 && (
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Top
                      </Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedCategories.map((category, index) => (
                <Card
                  key={category.id}
                  className="p-4 cursor-pointer hover-elevate transition-all"
                  onClick={() => handleCategoryClick(category.name)}
                  data-testid={`category-list-${category.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {getIcon(category.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.count.toLocaleString()} videos
                      </p>
                    </div>
                    {index < 3 && (
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

          {filteredCategories.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No categories found</h3>
              <p className="text-muted-foreground">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
