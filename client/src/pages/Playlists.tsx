import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SideDrawer } from "@/components/SideDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Plus, List, Play, Trash2, Edit2, Lock, Globe, MoreVertical, Video } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Category } from "@shared/schema";

interface Playlist {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  videos: string[];
  thumbnails: string[];
  createdAt: string;
  updatedAt: string;
}

const PLAYLISTS_STORAGE_KEY = "blueberry_playlists";

export default function Playlists() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  useEffect(() => {
    const stored = localStorage.getItem(PLAYLISTS_STORAGE_KEY);
    if (stored) {
      try {
        setPlaylists(JSON.parse(stored));
      } catch {
        setPlaylists([]);
      }
    }
  }, []);

  const savePlaylists = (updated: Playlist[]) => {
    localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(updated));
    setPlaylists(updated);
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a playlist name",
        variant: "destructive",
      });
      return;
    }

    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylistName.trim(),
      description: newPlaylistDescription.trim(),
      isPrivate,
      videos: [],
      thumbnails: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    savePlaylists([newPlaylist, ...playlists]);
    setNewPlaylistName("");
    setNewPlaylistDescription("");
    setIsPrivate(false);
    setIsCreateDialogOpen(false);
    toast({
      title: "Playlist created",
      description: `"${newPlaylist.name}" has been created`,
    });
  };

  const handleDeletePlaylist = (id: string) => {
    const updated = playlists.filter((p) => p.id !== id);
    savePlaylists(updated);
    toast({
      title: "Playlist deleted",
      description: "The playlist has been removed",
    });
  };

  const filteredPlaylists = playlists.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold" data-testid="text-playlists-title">
                My Playlists
              </h1>
              <p className="text-muted-foreground mt-1">
                Organize your favorite videos into playlists
              </p>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-create-playlist">
                  <Plus className="w-4 h-4 mr-2" />
                  New Playlist
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Playlist</DialogTitle>
                  <DialogDescription>
                    Give your playlist a name and optional description
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Input
                      placeholder="Playlist name"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      data-testid="input-playlist-name"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Description (optional)"
                      value={newPlaylistDescription}
                      onChange={(e) => setNewPlaylistDescription(e.target.value)}
                      data-testid="input-playlist-description"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isPrivate ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsPrivate(true)}
                      data-testid="button-private"
                    >
                      <Lock className="w-4 h-4 mr-1" />
                      Private
                    </Button>
                    <Button
                      variant={!isPrivate ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsPrivate(false)}
                      data-testid="button-public"
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      Public
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePlaylist} data-testid="button-confirm-create">
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {filteredPlaylists.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <List className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No playlists yet</h2>
              <p className="text-muted-foreground mb-6">
                Create your first playlist to organize your favorite videos
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Playlist
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlaylists.map((playlist) => (
                <Card
                  key={playlist.id}
                  className="group cursor-pointer hover-elevate"
                  onClick={() => navigate(`/playlist/${playlist.id}`)}
                  data-testid={`card-playlist-${playlist.id}`}
                >
                  <div className="aspect-video bg-muted relative overflow-hidden rounded-t-lg">
                    {playlist.thumbnails.length > 0 ? (
                      <div className="grid grid-cols-2 gap-0.5 absolute inset-0">
                        {playlist.thumbnails.slice(0, 4).map((thumb, i) => (
                          <img
                            key={i}
                            src={thumb}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Video className="w-12 h-12 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="absolute bottom-2 right-2 bg-black/70 text-white"
                    >
                      {playlist.videos.length} videos
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{playlist.name}</h3>
                        {playlist.description && (
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {playlist.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          {playlist.isPrivate ? (
                            <Lock className="w-3 h-3" />
                          ) : (
                            <Globe className="w-3 h-3" />
                          )}
                          <span>{playlist.isPrivate ? "Private" : "Public"}</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button size="icon" variant="ghost">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePlaylist(playlist.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
