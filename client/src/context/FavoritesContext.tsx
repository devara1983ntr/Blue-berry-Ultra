import { createContext, useContext, type ReactNode } from "react";
import { useFavorites } from "@/hooks/use-favorites";

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (videoId: string) => void;
  removeFavorite: (videoId: string) => void;
  toggleFavorite: (videoId: string) => void;
  isFavorite: (videoId: string) => boolean;
  count: number;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const favoritesState = useFavorites();

  return (
    <FavoritesContext.Provider value={favoritesState}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavoritesContext must be used within FavoritesProvider");
  }
  return context;
}
