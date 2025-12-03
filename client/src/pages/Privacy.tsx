import { Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Eye, Lock, Bell, Trash2, Globe } from 'lucide-react';

export default function Privacy() {
  const { t } = useLanguage();

  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, update your profile, or contact us for support. This may include:
      
      - Account information (username, email, password hash)
      - Usage data (videos watched, preferences, settings)
      - Device information (browser type, operating system)
      - Cookies and similar tracking technologies`,
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: `We use the information we collect to:
      
      - Provide, maintain, and improve our services
      - Personalize your experience and content recommendations
      - Send you technical notices and support messages
      - Monitor and analyze trends and usage
      - Detect and prevent fraud and abuse`,
    },
    {
      icon: Globe,
      title: 'Information Sharing',
      content: `We do not sell, trade, or otherwise transfer your personal information to third parties except:
      
      - With your consent
      - To comply with legal obligations
      - To protect our rights and prevent fraud
      - With service providers who assist in our operations`,
    },
    {
      icon: Bell,
      title: 'Cookies and Tracking',
      content: `We use cookies and similar technologies to:
      
      - Keep you logged in
      - Remember your preferences
      - Understand how you use our service
      - Deliver relevant advertisements
      
      You can control cookie preferences through our cookie consent banner or your browser settings.`,
    },
    {
      icon: Shield,
      title: 'Data Security',
      content: `We implement appropriate security measures to protect your personal information:
      
      - Encryption of data in transit and at rest
      - Secure password hashing
      - Regular security audits
      - Access controls and authentication
      
      However, no method of transmission over the Internet is 100% secure.`,
    },
    {
      icon: Trash2,
      title: 'Your Rights',
      content: `You have the right to:
      
      - Access your personal data
      - Correct inaccurate information
      - Delete your account and data
      - Export your data
      - Opt-out of marketing communications
      - Manage cookie preferences
      
      Contact us to exercise these rights.`,
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
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-privacy-title">
              {t.legal.privacyPolicy}
            </h1>
            <p className="text-sm text-muted-foreground">Last updated: December 2024</p>
          </div>
        </div>

        <Card data-testid="card-privacy-intro">
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              Your privacy is important to us. This Privacy Policy explains how Blueberry ("we", "us", or "our") collects, uses, shares, and protects your personal information when you use our adult video streaming service.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              By using our service, you agree to the collection and use of information in accordance with this policy. This service is intended for users aged 18 and above only.
            </p>
          </CardContent>
        </Card>

        {sections.map((section, index) => (
          <Card key={index} data-testid={`card-privacy-section-${index}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <section.icon className="w-5 h-5 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {section.content}
              </p>
            </CardContent>
          </Card>
        ))}

        <Card data-testid="card-contact-privacy">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy or your personal data, please contact us:
            </p>
            <Button asChild>
              <Link href="/contact" data-testid="link-contact">
                Contact Support
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground py-8">
          <p>&copy; 2024 Blueberry. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
