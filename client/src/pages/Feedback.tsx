import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SideDrawer } from "@/components/SideDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Send, Bug, Lightbulb, ThumbsUp, Star, CheckCircle2 } from "lucide-react";
import type { Category } from "@shared/schema";

type FeedbackType = "bug" | "feature" | "general" | "praise";

const feedbackTypes: { value: FeedbackType; label: string; icon: typeof Bug; color: string }[] = [
  { value: "bug", label: "Report Bug", icon: Bug, color: "text-red-500" },
  { value: "feature", label: "Feature Request", icon: Lightbulb, color: "text-yellow-500" },
  { value: "general", label: "General Feedback", icon: MessageSquare, color: "text-blue-500" },
  { value: "praise", label: "Send Praise", icon: ThumbsUp, color: "text-green-500" },
];

export default function Feedback() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter your feedback message",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    toast({
      title: "Feedback submitted",
      description: "Thank you for your feedback! We appreciate it.",
    });
  };

  const handleReset = () => {
    setFeedbackType("general");
    setSubject("");
    setMessage("");
    setEmail("");
    setRating(0);
    setIsSubmitted(false);
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
        onCategorySelect={() => {}}
        favoritesCount={0}
      />

      <main className="flex-1 pt-20 pb-8 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2" data-testid="text-feedback-title">
              Send Feedback
            </h1>
            <p className="text-muted-foreground">
              Help us improve by sharing your thoughts
            </p>
          </div>

          {isSubmitted ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Thank you!</h2>
                <p className="text-muted-foreground mb-6">
                  Your feedback has been submitted successfully. We appreciate you taking the time to help us improve.
                </p>
                <Button onClick={handleReset}>Send Another</Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Your Feedback</CardTitle>
                <CardDescription>
                  Select a feedback type and share your thoughts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {feedbackTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFeedbackType(type.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          feedbackType === type.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                        data-testid={`button-feedback-type-${type.value}`}
                      >
                        <type.icon className={`w-6 h-6 mx-auto mb-2 ${type.color}`} />
                        <span className="text-sm font-medium block">{type.label}</span>
                      </button>
                    ))}
                  </div>

                  {feedbackType === "praise" && (
                    <div>
                      <Label className="mb-3 block">Rate your experience</Label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1"
                            data-testid={`button-star-${star}`}
                          >
                            <Star
                              className={`w-8 h-8 transition-colors ${
                                star <= rating
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="subject">Subject (optional)</Label>
                    <Input
                      id="subject"
                      placeholder="Brief summary of your feedback"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="mt-2"
                      data-testid="input-feedback-subject"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder={
                        feedbackType === "bug"
                          ? "Please describe the bug and steps to reproduce it..."
                          : feedbackType === "feature"
                          ? "Describe the feature you'd like to see..."
                          : "Share your thoughts with us..."
                      }
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="mt-2 min-h-[150px]"
                      data-testid="textarea-feedback-message"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email for follow-up"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2"
                      data-testid="input-feedback-email"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      We may contact you for more details if needed
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !message.trim()}
                    data-testid="button-submit-feedback"
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
