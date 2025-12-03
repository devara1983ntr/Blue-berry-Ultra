import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/context/LanguageContext";
import { AgeVerificationProvider } from "@/context/AgeVerificationContext";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import { AuthProvider } from "@/context/AuthContext";
import { GuestLimitProvider } from "@/context/GuestLimitContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { PlaybackProvider } from "@/context/PlaybackContext";
import { AgeVerificationModal } from "@/components/AgeVerificationModal";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { GuestLimitBanner } from "@/components/GuestLimitBanner";
import Home from "@/pages/Home";
import VideoPlayer from "@/pages/VideoPlayer";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import Settings from "@/pages/Settings";
import History from "@/pages/History";
import WatchLater from "@/pages/WatchLater";
import Notifications from "@/pages/Notifications";
import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";
import Welcome from "@/pages/Welcome";
import Offline from "@/pages/Offline";
import Categories from "@/pages/Categories";
import Favorites from "@/pages/Favorites";
import Trending from "@/pages/Trending";
import Profile from "@/pages/Profile";
import SearchResults from "@/pages/SearchResults";
import Tags from "@/pages/Tags";
import Performers from "@/pages/Performers";
import NotFound from "@/pages/not-found";
import Playlists from "@/pages/Playlists";
import Help from "@/pages/Help";
import Feedback from "@/pages/Feedback";
import AccessibilitySettings from "@/pages/AccessibilitySettings";
import PlaybackSettings from "@/pages/PlaybackSettings";
import Downloads from "@/pages/Downloads";
import CategoryDetail from "@/pages/CategoryDetail";
import PerformerDetail from "@/pages/PerformerDetail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/video/:id" component={VideoPlayer} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/settings" component={Settings} />
      <Route path="/history" component={History} />
      <Route path="/watch-later" component={WatchLater} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/contact" component={Contact} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/offline" component={Offline} />
      <Route path="/categories" component={Categories} />
      <Route path="/category/:name" component={CategoryDetail} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/trending" component={Trending} />
      <Route path="/profile" component={Profile} />
      <Route path="/search" component={SearchResults} />
      <Route path="/tags" component={Tags} />
      <Route path="/performers" component={Performers} />
      <Route path="/performer/:name" component={PerformerDetail} />
      <Route path="/playlists" component={Playlists} />
      <Route path="/help" component={Help} />
      <Route path="/feedback" component={Feedback} />
      <Route path="/accessibility" component={AccessibilitySettings} />
      <Route path="/playback-settings" component={PlaybackSettings} />
      <Route path="/downloads" component={Downloads} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AgeVerificationProvider>
          <CookieConsentProvider>
            <AuthProvider>
              <GuestLimitProvider>
                <FavoritesProvider>
                  <PlaybackProvider>
                    <TooltipProvider>
                      <AgeVerificationModal />
                      <Toaster />
                      <Router />
                      <CookieConsentBanner />
                      <GuestLimitBanner />
                    </TooltipProvider>
                  </PlaybackProvider>
                </FavoritesProvider>
              </GuestLimitProvider>
            </AuthProvider>
          </CookieConsentProvider>
        </AgeVerificationProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
