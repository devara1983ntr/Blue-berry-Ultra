import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Home, 
  TrendingUp, 
  Clock, 
  Star, 
  Grid3X3,
  Users,
  Heart,
  Film,
  Sparkles,
  Code,
  Settings,
  User,
  HelpCircle,
  Info,
  Shield,
  FileText,
  Mail,
  MessageSquare,
  Accessibility,
  Play,
  Download,
  WifiOff,
  Bell,
  Bookmark,
  History,
  List,
  Tag,
  Folder,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Category } from "@shared/schema";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  favoritesCount?: number;
}

const browseItems = [
  { id: "home", name: "Home", icon: Home, href: "/" },
  { id: "trending", name: "Trending", icon: TrendingUp, href: "/trending" },
  { id: "recent", name: "Recently Added", icon: Clock, href: "/?filter=recent" },
  { id: "top-rated", name: "Top Rated", icon: Star, href: "/?filter=top-rated" },
  { id: "categories", name: "Categories", icon: Folder, href: "/categories" },
  { id: "performers", name: "Performers", icon: Users, href: "/performers" },
  { id: "tags", name: "Tags", icon: Tag, href: "/tags" },
];

const libraryItems = [
  { id: "favorites", name: "Favorites", icon: Heart, href: "/favorites" },
  { id: "watch-later", name: "Watch Later", icon: Bookmark, href: "/watch-later" },
  { id: "history", name: "History", icon: History, href: "/history" },
  { id: "playlists", name: "Playlists", icon: List, href: "/playlists" },
  { id: "downloads", name: "Downloads", icon: Download, href: "/downloads" },
];

const settingsItems = [
  { id: "profile", name: "Profile", icon: User, href: "/profile" },
  { id: "settings", name: "Settings", icon: Settings, href: "/settings" },
  { id: "playback", name: "Playback Settings", icon: Play, href: "/playback-settings" },
  { id: "accessibility", name: "Accessibility", icon: Accessibility, href: "/accessibility" },
  { id: "notifications", name: "Notifications", icon: Bell, href: "/notifications" },
  { id: "offline", name: "Offline Mode", icon: WifiOff, href: "/offline" },
];

const supportItems = [
  { id: "help", name: "Help Center", icon: HelpCircle, href: "/help" },
  { id: "feedback", name: "Send Feedback", icon: MessageSquare, href: "/feedback" },
  { id: "about", name: "About", icon: Info, href: "/about" },
  { id: "contact", name: "Contact Us", icon: Mail, href: "/contact" },
];

const legalItems = [
  { id: "privacy", name: "Privacy Policy", icon: Shield, href: "/privacy" },
  { id: "terms", name: "Terms of Service", icon: FileText, href: "/terms" },
];

export function SideDrawer({ 
  isOpen, 
  onClose, 
  categories,
  selectedCategory,
  onCategorySelect,
  favoritesCount = 0
}: SideDrawerProps) {
  const [location] = useLocation();

  const getCategoryIcon = (iconName: string) => {
    const icons: Record<string, typeof Home> = {
      film: Film,
      users: Users,
      heart: Heart,
      sparkles: Sparkles,
      star: Star,
      grid: Grid3X3,
    };
    return icons[iconName] || Grid3X3;
  };

  const NavSection = ({ 
    title, 
    items 
  }: { 
    title: string; 
    items: { id: string; name: string; icon: typeof Home; href: string }[] 
  }) => (
    <div className="px-3 mb-4">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
        {title}
      </h3>
      <nav className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || 
            (item.href.includes("filter=") && location.includes(item.href.split("=")[1]));
          
          return (
            <Link key={item.id} href={item.href} onClick={onClose}>
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 hover-elevate ${
                  isActive 
                    ? "bg-primary/20 text-primary" 
                    : "text-foreground/80 hover:text-foreground"
                }`}
                data-testid={`nav-item-${item.id}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.name}</span>
                {item.id === "favorites" && favoritesCount > 0 && (
                  <span className="ml-auto text-xs text-muted-foreground bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                    {favoritesCount}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
            data-testid="drawer-overlay"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[300px] glass-heavy z-50 flex flex-col"
            data-testid="side-drawer"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold font-['Poppins']">B</span>
                </div>
                <div>
                  <h2 className="font-semibold font-['Poppins'] text-foreground">Blueberry</h2>
                  <p className="text-xs text-muted-foreground">126,000+ Videos</p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={onClose}
                className="rounded-full"
                data-testid="button-close-drawer"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="py-4">
                <NavSection title="Browse" items={browseItems} />
                
                <Separator className="my-2 mx-6 bg-white/10" />
                
                <NavSection title="Your Library" items={libraryItems} />

                <Separator className="my-2 mx-6 bg-white/10" />

                <div className="px-3 mb-4">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
                    Categories
                  </h3>
                  <nav className="space-y-0.5">
                    <div
                      onClick={() => {
                        onCategorySelect(null);
                        onClose();
                      }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 cursor-pointer hover-elevate ${
                        selectedCategory === null 
                          ? "bg-primary/20 text-primary" 
                          : "text-foreground/80 hover:text-foreground"
                      }`}
                      data-testid="nav-category-all"
                    >
                      <Grid3X3 className="w-4 h-4" />
                      <span className="text-sm font-medium">All Videos</span>
                    </div>
                    {categories.slice(0, 15).map((category) => {
                      const Icon = getCategoryIcon(category.icon);
                      const isActive = selectedCategory === category.id;
                      
                      return (
                        <div
                          key={category.id}
                          onClick={() => {
                            onCategorySelect(category.id);
                            onClose();
                          }}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-150 cursor-pointer hover-elevate ${
                            isActive 
                              ? "bg-primary/20 text-primary" 
                              : "text-foreground/80 hover:text-foreground"
                          }`}
                          data-testid={`nav-category-${category.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{category.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">
                            {category.count.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                    {categories.length > 15 && (
                      <Link href="/categories" onClick={onClose}>
                        <div className="flex items-center gap-3 px-3 py-2 text-primary text-sm hover-elevate rounded-lg">
                          <Folder className="w-4 h-4" />
                          <span>View all {categories.length} categories</span>
                        </div>
                      </Link>
                    )}
                  </nav>
                </div>

                <Separator className="my-2 mx-6 bg-white/10" />

                <NavSection title="Settings" items={settingsItems} />

                <Separator className="my-2 mx-6 bg-white/10" />

                <NavSection title="Support" items={supportItems} />

                <Separator className="my-2 mx-6 bg-white/10" />

                <NavSection title="Legal" items={legalItems} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <Code className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Developed by</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-foreground/80">Roshan Sahu</p>
                <p className="text-sm text-foreground/80">Papun Sahu</p>
                <p className="text-sm text-foreground/80">Rohan Sahu</p>
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <Smartphone className="w-3 h-3" />
                <span>PWA Available</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date().getFullYear()} Blueberry. All rights reserved.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
