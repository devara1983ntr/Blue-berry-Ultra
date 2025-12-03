import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SideDrawer } from "@/components/SideDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { 
  Download, Play, Trash2, FolderOpen, Cloud, 
  HardDrive, AlertCircle, CheckCircle2, Pause
} from "lucide-react";
import type { Category } from "@shared/schema";

interface DownloadedVideo {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  duration: string;
  size: string;
  downloadedAt: string;
  status: "completed" | "downloading" | "paused" | "error";
  progress: number;
}

const STORAGE_KEY = "blueberry_downloads";

export default function Downloads() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [downloads, setDownloads] = useState<DownloadedVideo[]>([]);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setDownloads(JSON.parse(stored));
      } catch {
        setDownloads([]);
      }
    }
  }, []);

  const handleDelete = (id: string) => {
    const updated = downloads.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setDownloads(updated);
    toast({
      title: "Download removed",
      description: "The downloaded video has been deleted",
    });
  };

  const handleClearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDownloads([]);
    toast({
      title: "Downloads cleared",
      description: "All downloaded videos have been removed",
    });
  };

  const getStatusIcon = (status: DownloadedVideo["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "downloading":
        return <Download className="w-4 h-4 text-blue-500 animate-bounce" />;
      case "paused":
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const completedDownloads = downloads.filter((d) => d.status === "completed");
  const activeDownloads = downloads.filter((d) => d.status !== "completed");

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

      <main className="flex-1 pt-20 pb-8 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3" data-testid="text-downloads-title">
                <Download className="w-8 h-8 text-primary" />
                Downloads
              </h1>
              <p className="text-muted-foreground mt-1">
                Your downloaded videos for offline viewing
              </p>
            </div>
            {downloads.length > 0 && (
              <Button variant="outline" onClick={handleClearAll} data-testid="button-clear-downloads">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <HardDrive className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Storage Used</p>
                    <p className="text-2xl font-bold">0 MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Downloaded</p>
                    <p className="text-2xl font-bold">{completedDownloads.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Cloud className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold">{activeDownloads.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {downloads.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <FolderOpen className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No downloads yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Download videos to watch them offline. Downloads are saved locally to your device.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Note: Video downloads are currently not available due to content restrictions.
              </p>
              <Button onClick={() => navigate("/")} variant="outline">
                Browse Videos
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeDownloads.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Active Downloads</h2>
                  <div className="space-y-3">
                    {activeDownloads.map((download) => (
                      <Card key={download.id} data-testid={`download-active-${download.id}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-32 aspect-video rounded-lg overflow-hidden bg-muted">
                              <img
                                src={download.thumbnail}
                                alt={download.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                {getStatusIcon(download.status)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{download.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {download.duration} - {download.size}
                              </p>
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span>{download.progress}%</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {download.status}
                                  </Badge>
                                </div>
                                <Progress value={download.progress} className="h-1" />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {download.status === "downloading" && (
                                <Button size="icon" variant="ghost">
                                  <Pause className="w-4 h-4" />
                                </Button>
                              )}
                              {download.status === "paused" && (
                                <Button size="icon" variant="ghost">
                                  <Play className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(download.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {completedDownloads.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Completed</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedDownloads.map((download) => (
                      <Card
                        key={download.id}
                        className="group cursor-pointer hover-elevate"
                        onClick={() => navigate(`/video/${download.videoId}`)}
                        data-testid={`download-completed-${download.id}`}
                      >
                        <div className="aspect-video relative rounded-t-lg overflow-hidden bg-muted">
                          <img
                            src={download.thumbnail}
                            alt={download.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-12 h-12 text-white" />
                          </div>
                          <Badge
                            variant="secondary"
                            className="absolute bottom-2 right-2 bg-black/70 text-white"
                          >
                            {download.duration}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium truncate mb-1">{download.title}</h3>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{download.size}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(download.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
