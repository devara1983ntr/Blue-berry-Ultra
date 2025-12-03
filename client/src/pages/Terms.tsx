import { Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, AlertTriangle, Check, Ban, Scale, Shield } from 'lucide-react';

export default function Terms() {
  const { t } = useLanguage();

  const sections = [
    {
      icon: Check,
      title: 'Acceptance of Terms',
      content: `By accessing or using Blueberry ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
      
      These Terms constitute a legally binding agreement between you and Blueberry. We may update these Terms from time to time, and your continued use of the Service constitutes acceptance of any changes.`,
    },
    {
      icon: AlertTriangle,
      title: 'Age Requirement',
      content: `IMPORTANT: This Service contains adult content and is intended ONLY for users who are:
      
      - At least 18 years of age, OR
      - The age of legal majority in their jurisdiction, whichever is higher
      
      By using this Service, you confirm that you meet these age requirements. We reserve the right to verify age and terminate accounts that violate this policy.`,
    },
    {
      icon: FileText,
      title: 'User Accounts',
      content: `When you create an account, you agree to:
      
      - Provide accurate and complete information
      - Maintain the security of your account credentials
      - Promptly update any information that changes
      - Accept responsibility for all activities under your account
      - Not share your account with others
      
      We reserve the right to suspend or terminate accounts that violate these Terms.`,
    },
    {
      icon: Ban,
      title: 'Prohibited Activities',
      content: `You agree NOT to:
      
      - Use the Service if you are under the legal age
      - Share your account credentials
      - Attempt to bypass any access restrictions
      - Download, copy, or redistribute content without authorization
      - Use automated tools to access the Service
      - Harass, abuse, or harm others
      - Violate any applicable laws or regulations
      - Attempt to reverse engineer the Service`,
    },
    {
      icon: Scale,
      title: 'Intellectual Property',
      content: `All content on this Service, including videos, images, text, and software, is protected by copyright and other intellectual property laws.
      
      - Content is licensed, not sold
      - You may not reproduce, distribute, or create derivative works
      - Trademarks and logos are property of their respective owners
      - User-generated content remains your property, but you grant us a license to use it`,
    },
    {
      icon: Shield,
      title: 'Disclaimer of Warranties',
      content: `THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
      
      We do not warrant that:
      - The Service will be uninterrupted or error-free
      - Content will be accurate or complete
      - The Service will meet your requirements
      
      Use of the Service is at your own risk.`,
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
            <h1 className="text-3xl font-bold" data-testid="text-terms-title">
              {t.legal.termsOfService}
            </h1>
            <p className="text-sm text-muted-foreground">Last updated: December 2024</p>
          </div>
        </div>

        <Card className="border-destructive/50 bg-destructive/5" data-testid="card-terms-warning">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-destructive mb-2">Adult Content Warning</h3>
                <p className="text-sm text-muted-foreground">
                  This website contains sexually explicit material intended for adults only. By using this website, you confirm that you are at least 18 years of age (or the age of majority in your jurisdiction) and that viewing adult content is legal in your location.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {sections.map((section, index) => (
          <Card key={index} data-testid={`card-terms-section-${index}`}>
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

        <Card data-testid="card-terms-contact">
          <CardHeader>
            <CardTitle>Questions About These Terms?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact our support team.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/contact" data-testid="link-contact">
                  Contact Support
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/privacy" data-testid="link-privacy">
                  {t.legal.privacyPolicy}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground py-8">
          <p>&copy; 2024 Blueberry. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
