import { Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Heart, Code, Users, Sparkles } from 'lucide-react';

export default function About() {
  const { t } = useLanguage();

  const developers = [
    {
      name: 'Roshan Sahu',
      role: 'Lead Developer',
      description: 'Full-stack architecture and system design',
    },
    {
      name: 'Papun Sahu',
      role: 'Frontend Developer',
      description: 'UI/UX design and user experience',
    },
    {
      name: 'Rohan Sahu',
      role: 'Backend Developer',
      description: 'API development and database management',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/" data-testid="button-back-home">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold" data-testid="text-about-title">
            {t.legal.aboutUs}
          </h1>
        </div>

        <Card data-testid="card-about-blueberry">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              About Blueberry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Blueberry is a premium adult video streaming platform designed to provide users with a seamless and enjoyable viewing experience. Our platform features a vast library of content, advanced playback controls, and personalized recommendations.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We are committed to providing a safe, secure, and respectful environment for our adult users. All content on our platform is intended for users aged 18 and above.
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-features">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid md:grid-cols-2 gap-4">
              {[
                'Extensive video library with 126,000+ videos',
                'Multi-language support (English, Hindi, Odia, Tamil, Telugu)',
                'Mandatory 18+ age verification',
                'Advanced gesture controls for playback',
                'Watch later and favorites lists',
                'History tracking and guest limits',
                'Dark mode premium design',
                'Mobile-responsive with pagination',
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card data-testid="card-developers">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              {t.legal.developers}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {developers.map((dev, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-lg bg-muted/50 hover-elevate"
                  data-testid={`card-developer-${index}`}
                >
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{dev.name}</h3>
                  <p className="text-sm text-primary mb-1">{dev.role}</p>
                  <p className="text-xs text-muted-foreground">{dev.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-contact">
          <CardHeader>
            <CardTitle>{t.legal.contactSupport}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Have questions or need assistance? We're here to help.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/contact" data-testid="link-contact-support">
                  Contact Support
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/privacy" data-testid="link-privacy">
                  {t.legal.privacyPolicy}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/terms" data-testid="link-terms">
                  {t.legal.termsOfService}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground py-8">
          <p>&copy; 2024 Blueberry. All rights reserved.</p>
          <p className="mt-1">Made with love by the Blueberry Team</p>
        </div>
      </div>
    </div>
  );
}
