import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User, sendPasswordResetEmail } from "firebase/auth";
import { getDatabase, ref, set, get, update, remove, onValue, push, child } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDEBvzh8F4iIAG9NRlZT0ZQEgWHdgOPVzM",
  authDomain: "blue-berry-748cb.firebaseapp.com",
  databaseURL: "https://blue-berry-748cb-default-rtdb.firebaseio.com",
  projectId: "blue-berry-748cb",
  storageBucket: "blue-berry-748cb.firebasestorage.app",
  messagingSenderId: "250482902334",
  appId: "1:250482902334:web:02dfd510b6cca2ed96986f",
  measurementId: "G-8142DGS5WG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  createdAt: string;
  lastLoginAt: string;
  preferences: {
    darkMode: boolean;
    autoplay: boolean;
    quality: string;
    notifications: boolean;
  };
}

export interface WatchHistoryItem {
  videoId: string;
  title: string;
  thumbnail: string;
  duration: string;
  watchedAt: string;
  progress: number;
  lastPosition: number;
}

export interface FavoriteItem {
  videoId: string;
  title: string;
  thumbnail: string;
  duration: string;
  addedAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  videos: string[];
  isPublic: boolean;
}

export const firebaseAuth = {
  signIn: async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await updateLastLogin(result.user.uid);
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  signUp: async (email: string, password: string, username: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(result.user.uid, email, username);
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  signOut: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  resetPassword: async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  onAuthChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  }
};

export const createUserProfile = async (uid: string, email: string, username: string) => {
  const userRef = ref(database, `users/${uid}`);
  const profile: UserProfile = {
    uid,
    email,
    username,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    preferences: {
      darkMode: true,
      autoplay: true,
      quality: 'auto',
      notifications: true
    }
  };
  await set(userRef, profile);
  return profile;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = ref(database, `users/${uid}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return snapshot.val() as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
  const userRef = ref(database, `users/${uid}`);
  await update(userRef, updates);
};

export const updateUserPreferences = async (uid: string, preferences: Partial<UserProfile['preferences']>) => {
  const prefsRef = ref(database, `users/${uid}/preferences`);
  await update(prefsRef, preferences);
};

const updateLastLogin = async (uid: string) => {
  const userRef = ref(database, `users/${uid}`);
  await update(userRef, { lastLoginAt: new Date().toISOString() });
};

export const watchHistoryService = {
  add: async (uid: string, item: WatchHistoryItem) => {
    const historyRef = ref(database, `watchHistory/${uid}/${item.videoId}`);
    await set(historyRef, item);
  },

  get: async (uid: string): Promise<WatchHistoryItem[]> => {
    const historyRef = ref(database, `watchHistory/${uid}`);
    const snapshot = await get(historyRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const items: WatchHistoryItem[] = Object.values(data);
      return items.sort((a, b) => 
        new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime()
      );
    }
    return [];
  },

  updateProgress: async (uid: string, videoId: string, progress: number, lastPosition: number) => {
    const historyRef = ref(database, `watchHistory/${uid}/${videoId}`);
    await update(historyRef, { progress, lastPosition, watchedAt: new Date().toISOString() });
  },

  remove: async (uid: string, videoId: string) => {
    const historyRef = ref(database, `watchHistory/${uid}/${videoId}`);
    await remove(historyRef);
  },

  clear: async (uid: string) => {
    const historyRef = ref(database, `watchHistory/${uid}`);
    await remove(historyRef);
  },

  subscribe: (uid: string, callback: (items: WatchHistoryItem[]) => void) => {
    const historyRef = ref(database, `watchHistory/${uid}`);
    return onValue(historyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const items: WatchHistoryItem[] = Object.values(data);
        items.sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime());
        callback(items);
      } else {
        callback([]);
      }
    });
  }
};

export const favoritesService = {
  add: async (uid: string, item: FavoriteItem) => {
    const favRef = ref(database, `favorites/${uid}/${item.videoId}`);
    await set(favRef, item);
  },

  get: async (uid: string): Promise<FavoriteItem[]> => {
    const favRef = ref(database, `favorites/${uid}`);
    const snapshot = await get(favRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const items: FavoriteItem[] = Object.values(data);
      return items.sort((a, b) => 
        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      );
    }
    return [];
  },

  remove: async (uid: string, videoId: string) => {
    const favRef = ref(database, `favorites/${uid}/${videoId}`);
    await remove(favRef);
  },

  check: async (uid: string, videoId: string): Promise<boolean> => {
    const favRef = ref(database, `favorites/${uid}/${videoId}`);
    const snapshot = await get(favRef);
    return snapshot.exists();
  },

  subscribe: (uid: string, callback: (items: FavoriteItem[]) => void) => {
    const favRef = ref(database, `favorites/${uid}`);
    return onValue(favRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const items: FavoriteItem[] = Object.values(data);
        items.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
        callback(items);
      } else {
        callback([]);
      }
    });
  }
};

export const watchLaterService = {
  add: async (uid: string, item: FavoriteItem) => {
    const wlRef = ref(database, `watchLater/${uid}/${item.videoId}`);
    await set(wlRef, item);
  },

  get: async (uid: string): Promise<FavoriteItem[]> => {
    const wlRef = ref(database, `watchLater/${uid}`);
    const snapshot = await get(wlRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const items: FavoriteItem[] = Object.values(data);
      return items.sort((a, b) => 
        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      );
    }
    return [];
  },

  remove: async (uid: string, videoId: string) => {
    const wlRef = ref(database, `watchLater/${uid}/${videoId}`);
    await remove(wlRef);
  },

  check: async (uid: string, videoId: string): Promise<boolean> => {
    const wlRef = ref(database, `watchLater/${uid}/${videoId}`);
    const snapshot = await get(wlRef);
    return snapshot.exists();
  },

  subscribe: (uid: string, callback: (items: FavoriteItem[]) => void) => {
    const wlRef = ref(database, `watchLater/${uid}`);
    return onValue(wlRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const items: FavoriteItem[] = Object.values(data);
        items.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
        callback(items);
      } else {
        callback([]);
      }
    });
  }
};

export const playlistService = {
  create: async (uid: string, name: string, description: string = ''): Promise<string> => {
    const playlistsRef = ref(database, `playlists/${uid}`);
    const newPlaylistRef = push(playlistsRef);
    const playlist: Playlist = {
      id: newPlaylistRef.key!,
      name,
      description,
      createdAt: new Date().toISOString(),
      videos: [],
      isPublic: false
    };
    await set(newPlaylistRef, playlist);
    return playlist.id;
  },

  get: async (uid: string): Promise<Playlist[]> => {
    const playlistsRef = ref(database, `playlists/${uid}`);
    const snapshot = await get(playlistsRef);
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  },

  addVideo: async (uid: string, playlistId: string, videoId: string) => {
    const playlistRef = ref(database, `playlists/${uid}/${playlistId}/videos`);
    const snapshot = await get(playlistRef);
    const currentVideos = snapshot.exists() ? snapshot.val() : [];
    if (!currentVideos.includes(videoId)) {
      await set(playlistRef, [...currentVideos, videoId]);
    }
  },

  removeVideo: async (uid: string, playlistId: string, videoId: string) => {
    const playlistRef = ref(database, `playlists/${uid}/${playlistId}/videos`);
    const snapshot = await get(playlistRef);
    if (snapshot.exists()) {
      const currentVideos = snapshot.val().filter((v: string) => v !== videoId);
      await set(playlistRef, currentVideos);
    }
  },

  delete: async (uid: string, playlistId: string) => {
    const playlistRef = ref(database, `playlists/${uid}/${playlistId}`);
    await remove(playlistRef);
  },

  update: async (uid: string, playlistId: string, updates: Partial<Playlist>) => {
    const playlistRef = ref(database, `playlists/${uid}/${playlistId}`);
    await update(playlistRef, updates);
  }
};

export default app;
