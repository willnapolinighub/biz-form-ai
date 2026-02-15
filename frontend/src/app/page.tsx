import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Briefcase,
  FileText,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Globe,
  Bot,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">BizFormAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium">
              Sign In
            </Link>
            <Button asChild>
              <Link href="/dashboard">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6">
            <Zap className="w-3 h-3 mr-1" /> AI-Powered Formation
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
            Start Your Business in Minutes, Not Weeks
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Our AI agents handle the complexity of business formation—entity selection,
            document drafting, state filing, and compliance. All automated.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Start Your Business <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#how-it-works">
                See How It Works
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Form a Business</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Traditional legal formation takes weeks and thousands of dollars.
              We use AI to automate 90% of the work.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Bot className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>AI Business Classification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Describe your business idea and our AI analyzes it to recommend
                  the optimal entity type, NAICS code, and compliance requirements.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <FileText className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Automated Document Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  AI drafts Articles of Organization, Operating Agreements,
                  and banking resolutions in seconds—customized to your needs.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>State Filing Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We handle the paperwork with state secretaries.
                  Track your filing status in real-time from your dashboard.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Globe className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Multi-State Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Form in Delaware, Wyoming, or any state.
                  We handle foreign qualification for other states automatically.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>EIN Application Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get help with your Employer Identification Number application.
                  AI pre-fills IRS Form SS-4 based on your formation data.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CheckCircle2 className="w-10 h-10 mb-2 text-primary" />
                <CardTitle>Compliance Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Stay compliant with automated annual report reminders
                  and franchise tax calculations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              From idea to incorporated business in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Describe Your Business</h3>
              <p className="text-muted-foreground">
                Tell us what you want to do—our AI analyzes your idea and recommends
                the best entity structure for your goals.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Generates Documents</h3>
              <p className="text-muted-foreground">
                Our AI drafts all required legal documents instantly.
                Review, make changes, and approve in minutes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">We File for You</h3>
              <p className="text-muted-foreground">
                We submit your documents to the state.
                Track progress and get your approved documents delivered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground">
              One flat fee. No hidden costs. No attorney retainers.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>LLC</CardTitle>
                <CardDescription>Single Member or Multi-Member</CardDescription>
                <div className="text-4xl font-bold mt-4">$299</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>AI Business Classification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Articles of Organization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Operating Agreement</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>State Filing Fees Included</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <Link href="/dashboard?type=llc">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-2 border-primary">
              <CardHeader>
                <Badge className="w-fit mb-2">Most Popular</Badge>
                <CardTitle>C Corporation</CardTitle>
                <CardDescription>For Startups Seeking Investors</CardDescription>
                <div className="text-4xl font-bold mt-4">$499</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Everything in LLC</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Articles of Incorporation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Bylaws & Resolutions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Stock Certificate Template</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <Link href="/dashboard?type=corp">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader>
                <CardTitle>S Corporation</CardTitle>
                <CardDescription>Tax-Flexibility Option</CardDescription>
                <div className="text-4xl font-bold mt-4">$399</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Everything in C Corp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>IRS S-Corp Election</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Tax Planning Guidance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Annual Meeting Minutes</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <Link href="/dashboard?type=scorp">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">BizFormAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 BizFormAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
