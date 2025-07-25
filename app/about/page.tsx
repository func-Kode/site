import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto container-mobile py-8 md:py-12 max-w-4xl safe-bottom">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="mb-4 md:mb-6">
            <span className="text-4xl md:text-6xl">🧑‍🚀</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-brand-blue to-primary bg-clip-text text-transparent">
            About Us
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8">
            Welcome to func(Kode) 👨‍💻🌐
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8 md:space-y-12">
          {/* Introduction */}
          <Card className="border-0 shadow-lg card-hover">
            <CardContent className="p-6 md:p-8">
              <p className="text-lg leading-relaxed text-foreground">
                At its core, <strong>func(Kode)</strong> is more than just a developer community — it's a movement.
                We're building a hybrid space (both online and offline) where developers, coders, and tech enthusiasts
                can come together to collaborate, showcase projects, learn from one another, and push boundaries.
              </p>
              <p className="text-lg leading-relaxed text-foreground mt-4">
                Whether you're writing your first line of code or launching your tenth startup, func(Kode) is designed
                to be your home base — a place where your curiosity is encouraged, your skills are sharpened, and your voice matters.
              </p>
            </CardContent>
          </Card>

          {/* Mission */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-brand-blue/5">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🎯</span>
                <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
              </div>
              <p className="text-lg leading-relaxed text-foreground">
                To empower developers by fostering an inclusive and vibrant space where creativity, learning,
                and community thrive — online and in the real world.
              </p>
            </CardContent>
          </Card>

          {/* What We're Building */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🚀</span>
                <h2 className="text-2xl font-bold text-foreground">What We're Building</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-1">✨</Badge>
                    <p className="text-foreground">A collaborative platform to share and track open-source contributions</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-1">📊</Badge>
                    <p className="text-foreground">A personal dashboard to visualize your GitHub activity and growth</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-1">🎨</Badge>
                    <p className="text-foreground">A public showcase hub for your coolest projects</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-1">🎯</Badge>
                    <p className="text-foreground">Regular community challenges, events, and meetups</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-1">🤖</Badge>
                    <p className="text-foreground">AI-assisted tools to help you learn, debug, and ship faster</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-center text-foreground font-medium">
                  We're here to connect people, not just profiles. The idea is simple: <strong>Build. Share. Learn. Repeat.</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Hybrid Experience */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-brand-green/5 to-primary/5">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🌍</span>
                <h2 className="text-2xl font-bold text-foreground">The Hybrid Experience</h2>
              </div>
              <p className="text-lg leading-relaxed text-foreground mb-6">
                We believe the best tech communities exist beyond just pixels. That's why func(Kode) is built with a dual spirit:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-background rounded-lg shadow-sm">
                  <span className="text-4xl mb-3 block">🌐</span>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Online</h3>
                  <p className="text-muted-foreground">Community dashboard, GitHub integration, learning hub</p>
                </div>
                <div className="text-center p-6 bg-background rounded-lg shadow-sm">
                  <span className="text-4xl mb-3 block">🏙️</span>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Offline</h3>
                  <p className="text-muted-foreground">Local meetups, hackathons, and coffee-code sessions in your city</p>
                </div>
              </div>
              <p className="text-center text-foreground mt-6">
                We're starting small — with a group of early contributors — and scaling thoughtfully.
              </p>
            </CardContent>
          </Card>

          {/* Why func(Kode) */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🧩</span>
                <h2 className="text-2xl font-bold text-foreground">Why "func(Kode)"?</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-lg px-3 py-1">func</Badge>
                  <p className="text-foreground">a function, the fundamental unit of logic</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-lg px-3 py-1">Kode</Badge>
                  <p className="text-foreground">a nod to code + creativity</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <p className="text-center text-foreground font-medium">
                  Together, it represents what we stand for: <strong>Functional creativity. Collective problem-solving. And fun.</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Founder */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-muted/50 to-background">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">👤</span>
                <h2 className="text-2xl font-bold text-foreground">Who's Behind This?</h2>
              </div>
              <p className="text-lg leading-relaxed text-foreground">
                Hi, I'm <strong>Basanth</strong>, the solo dev and founder behind this idea. What started as a weekend thought
                has grown into a project with real momentum and mission. And now, you're part of it too.
              </p>
            </CardContent>
          </Card>

          {/* Join the Movement */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/10 to-brand-blue/10">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-3xl">🔗</span>
                <h2 className="text-2xl font-bold text-foreground">Join the Movement</h2>
              </div>
              <p className="text-lg leading-relaxed text-foreground mb-6">
                We're still early — and that's the best time to join. Whether you're a:
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <Badge variant="secondary" className="text-sm px-3 py-1">💻 Developer</Badge>
                <Badge variant="secondary" className="text-sm px-3 py-1">🎨 Designer</Badge>
                <Badge variant="secondary" className="text-sm px-3 py-1">✍️ Writer</Badge>
                <Badge variant="secondary" className="text-sm px-3 py-1">📚 Student</Badge>
                <Badge variant="secondary" className="text-sm px-3 py-1">🧠 Hacker</Badge>
              </div>
              <p className="text-lg text-foreground mb-8">
                There's a place for you here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-brand-blue hover:bg-brand-blue/90">
                  <Link href="/auth/sign-up">Join Our Community</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/dashboard">Explore Dashboard</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                → Join our Discord, explore the GitHub, and become a founding member of func(Kode).
                Let's build the most human dev community — one line at a time.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}