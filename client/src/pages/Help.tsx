import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SideDrawer } from "@/components/SideDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import {
  HelpCircle,
  Search,
  Play,
  User,
  Shield,
  Bookmark,
  Settings,
  MessageCircle,
  Mail,
  ExternalLink,
} from "lucide-react";
import type { Category } from "@shared/schema";

const faqs = [
  {
    category: "playback",
    icon: Play,
    questions: [
      {
        q: "Why won't the video play?",
        a: "Videos may not play due to browser restrictions, slow internet, or ad blockers. Try refreshing the page, disabling ad blockers, or switching browsers. Make sure your browser is up to date.",
      },
      {
        q: "How do I change video quality?",
        a: "Video quality is automatically adjusted based on your internet speed. Some videos may have quality options in the embedded player controls.",
      },
      {
        q: "Can I download videos?",
        a: "Video downloads are not supported at this time. You can use the Watch Later feature to save videos for easy access later.",
      },
      {
        q: "How do I use fullscreen mode?",
        a: "Click the fullscreen button in the video player, or press 'F' on your keyboard. Press Escape or 'F' again to exit fullscreen.",
      },
    ],
  },
  {
    category: "account",
    icon: User,
    questions: [
      {
        q: "How do I create an account?",
        a: "Click the 'Sign Up' button in the header and fill in your details. You can also sign in with Google or other providers.",
      },
      {
        q: "How do I reset my password?",
        a: "Click 'Forgot Password' on the login page and enter your email. We'll send you a link to reset your password.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes, you can delete your account from the Settings page. Note that this action is permanent and cannot be undone.",
      },
    ],
  },
  {
    category: "privacy",
    icon: Shield,
    questions: [
      {
        q: "Is my viewing history private?",
        a: "Yes, your viewing history is stored locally on your device and is not shared. You can clear your history at any time from the History page.",
      },
      {
        q: "How do I clear my watch history?",
        a: "Go to Settings > Privacy & Security and click 'Clear Watch History'. You can also clear individual items from the History page.",
      },
      {
        q: "What data do you collect?",
        a: "We collect minimal data necessary for the service. See our Privacy Policy for full details on data collection and usage.",
      },
    ],
  },
  {
    category: "features",
    icon: Bookmark,
    questions: [
      {
        q: "How do I save videos for later?",
        a: "Click the bookmark icon on any video to add it to your Watch Later list. Access your saved videos from the Watch Later page.",
      },
      {
        q: "How do favorites work?",
        a: "Click the heart icon to add a video to your favorites. Favorites are stored locally and can be accessed from the Favorites page.",
      },
      {
        q: "Can I create playlists?",
        a: "Yes! Go to the Playlists page to create and manage your custom playlists. You can add videos to playlists from the video page.",
      },
    ],
  },
];

export default function Help() {
  const { t } = useLanguage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [helpSearch, setHelpSearch] = useState("");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(helpSearch.toLowerCase()) ||
          q.a.toLowerCase().includes(helpSearch.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <HelpCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2" data-testid="text-help-title">
              Help Center
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Find answers to common questions or contact our support team
            </p>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for help..."
              value={helpSearch}
              onChange={(e) => setHelpSearch(e.target.value)}
              className="pl-12 h-12 text-lg"
              data-testid="input-help-search"
            />
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No results found for "{helpSearch}"</p>
              <Button variant="ghost" onClick={() => setHelpSearch("")}>
                Clear search
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredFaqs.map((category) => (
                <Card key={category.category} data-testid={`card-faq-${category.category}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <category.icon className="w-5 h-5 text-primary" />
                      {category.category.charAt(0).toUpperCase() + category.category.slice(1)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, index) => (
                        <AccordionItem
                          key={index}
                          value={`${category.category}-${index}`}
                          data-testid={`accordion-item-${category.category}-${index}`}
                        >
                          <AccordionTrigger className="text-left">
                            {faq.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Still need help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for? Contact our support team.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" asChild>
                  <a href="/contact">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/feedback">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Feedback
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Keyboard Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "F", desc: "Toggle fullscreen" },
                  { key: "T", desc: "Toggle theater mode" },
                  { key: "M", desc: "Toggle mute" },
                  { key: "Space / K", desc: "Play/Pause" },
                  { key: "J", desc: "Rewind 10 seconds" },
                  { key: "L", desc: "Forward 10 seconds" },
                  { key: "Arrow Up/Down", desc: "Volume up/down" },
                  { key: "0-9", desc: "Seek to 0%-90%" },
                ].map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="text-sm">{shortcut.desc}</span>
                    <kbd className="px-2 py-1 bg-background border rounded text-sm font-mono">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
