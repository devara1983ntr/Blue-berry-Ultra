import { Link } from "wouter";
import { 
  Code, Heart, TrendingUp, Clock, Star, Grid3X3,
  Users, Tag, Folder, Bookmark, History, Download,
  Settings, User, Play, Bell, WifiOff, Accessibility,
  HelpCircle, MessageSquare, Info, Mail, Shield, FileText
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="mt-auto border-t border-white/5 bg-black/20"
      data-testid="footer"
    >
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl font-['Poppins']">B</span>
              </div>
              <span className="text-2xl font-bold font-['Poppins'] gradient-text">
                Blueberry
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-4">
              Your premium destination for adult entertainment with a modern, elegant streaming experience. 126,000+ videos available.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Developed By
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-foreground/80 text-sm flex items-center gap-2">
                <Heart className="w-3 h-3 text-red-400" />
                Roshan Sahu
              </p>
              <p className="text-foreground/80 text-sm flex items-center gap-2">
                <Heart className="w-3 h-3 text-red-400" />
                Papun Sahu
              </p>
              <p className="text-foreground/80 text-sm flex items-center gap-2">
                <Heart className="w-3 h-3 text-red-400" />
                Rohan Sahu
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Browse
            </h3>
            <nav className="space-y-2">
              <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Grid3X3 className="w-3 h-3" /> All Videos
              </Link>
              <Link href="/trending" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <TrendingUp className="w-3 h-3" /> Trending
              </Link>
              <Link href="/?filter=recent" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Clock className="w-3 h-3" /> Recently Added
              </Link>
              <Link href="/?filter=top-rated" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Star className="w-3 h-3" /> Top Rated
              </Link>
              <Link href="/categories" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Folder className="w-3 h-3" /> Categories
              </Link>
              <Link href="/performers" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Users className="w-3 h-3" /> Performers
              </Link>
              <Link href="/tags" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Tag className="w-3 h-3" /> Tags
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Library
            </h3>
            <nav className="space-y-2">
              <Link href="/favorites" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Heart className="w-3 h-3" /> Favorites
              </Link>
              <Link href="/watch-later" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Bookmark className="w-3 h-3" /> Watch Later
              </Link>
              <Link href="/history" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <History className="w-3 h-3" /> History
              </Link>
              <Link href="/playlists" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Folder className="w-3 h-3" /> Playlists
              </Link>
              <Link href="/downloads" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Download className="w-3 h-3" /> Downloads
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Settings
            </h3>
            <nav className="space-y-2">
              <Link href="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <User className="w-3 h-3" /> Profile
              </Link>
              <Link href="/settings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Settings className="w-3 h-3" /> Settings
              </Link>
              <Link href="/playback-settings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Play className="w-3 h-3" /> Playback
              </Link>
              <Link href="/accessibility" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Accessibility className="w-3 h-3" /> Accessibility
              </Link>
              <Link href="/notifications" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="w-3 h-3" /> Notifications
              </Link>
              <Link href="/offline" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <WifiOff className="w-3 h-3" /> Offline Mode
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Support
            </h3>
            <nav className="space-y-2">
              <Link href="/help" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <HelpCircle className="w-3 h-3" /> Help Center
              </Link>
              <Link href="/feedback" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <MessageSquare className="w-3 h-3" /> Feedback
              </Link>
              <Link href="/about" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Info className="w-3 h-3" /> About
              </Link>
              <Link href="/contact" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-3 h-3" /> Contact
              </Link>
              <Link href="/privacy" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Shield className="w-3 h-3" /> Privacy
              </Link>
              <Link href="/terms" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <FileText className="w-3 h-3" /> Terms
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-sm text-muted-foreground" data-testid="footer-copyright">
            {currentYear} Blueberry. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            All content is sourced from third-party providers. Users must be 18+ to access this site.
          </p>
        </div>
      </div>
    </footer>
  );
}
