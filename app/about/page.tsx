"use client";
import Script from "next/script";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("mission");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [user, setUser] = useState<object | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user as unknown as object | null);
    };
    getUser();
  }, [supabase.auth]);

  const handleDashboardClick = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const socialLinks = [
    { name: "GitHub", icon: "🐙", url: "https://github.com/func-Kode", color: "bg-gray-900" },
    { name: "Discord", icon: "💬", url: "#", color: "bg-indigo-600" },
    { name: "Twitter", icon: "🐦", url: "#", color: "bg-blue-500" },
    { name: "LinkedIn", icon: "💼", url: "#", color: "bg-blue-700" },
  ];

  const achievements = [
    { icon: "⭐", count: "100+", label: "Community Members" },
    { icon: "🚀", count: "50+", label: "Projects Showcased" },
    { icon: "🎯", count: "25+", label: "Open Source Contributions" },
    { icon: "🏆", count: "10+", label: "Hackathons Organized" },
  ];

  return (
    <div className="bg-gradient-to-br from-background to-muted/20">
      {/* Structured Data */}
      <Script id="ld-org" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'funcKode',
          url: process.env.NEXT_PUBLIC_SITE_URL || 'https://func-kode.netlify.app',
          sameAs: ['https://github.com/func-Kode'],
          founder: {
            '@type': 'Person',
            name: 'VVS Basanth Pedapati',
          },
        })}
      </Script>
      <div className="container mx-auto container-mobile py-8 md:py-12 max-w-6xl safe-bottom">
        {/* Hero Section with Founder Info */}
        <div className="text-center mb-12 md:mb-16">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/20 to-brand-green/20 rounded-full blur-3xl"></div>
            <div className="relative bg-card rounded-2xl p-8 shadow-xl border">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-brand-blue to-brand-green rounded-full flex items-center justify-center text-4xl md:text-5xl font-bold text-white shadow-lg">
                    V
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-green rounded-full flex items-center justify-center text-white text-sm">
                    ✓
                  </div>
                </div>
                <div className="text-center md:text-left flex-1">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">VVS Basanth Pedapati</h1>
                    <Badge variant="secondary" className="text-xs">Founder</Badge>
                  </div>
                  <p className="text-lg text-brand-blue font-semibold mb-2">Solo Developer & Community Builder</p>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md">
                    Passionate about creating inclusive developer communities where code meets creativity. 
                    Building func(Kode) to empower developers worldwide.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                    {socialLinks.map((social) => (
                      <Link
                        key={social.name}
                        href={social.url}
                        className={`${social.color} text-white px-3 py-1 rounded-full text-xs font-medium hover:scale-105 transition-transform duration-200 flex items-center gap-1`}
                      >
                        <span>{social.icon}</span>
                        {social.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border">
                {achievements.map((achievement, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <div className="text-xl font-bold text-foreground">{achievement.count}</div>
                    <div className="text-xs text-muted-foreground">{achievement.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-brand-blue to-primary bg-clip-text text-transparent">
            About func(Kode)
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8">
            Where Code Meets Community 🚀✨
          </p>
        </div>

        {/* Interactive Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: "mission", label: "Our Mission", icon: "🎯" },
              { id: "story", label: "Our Story", icon: "📖" },
              { id: "vision", label: "Vision", icon: "🔮" },
              { id: "community", label: "Community", icon: "👥" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-brand-blue text-white shadow-lg"
                    : "bg-card text-foreground hover:bg-muted"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              {activeTab === "mission" && (
                <div className="space-y-6 animate-slide-in">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-4">🎯 Our Mission</h3>
                    <p className="text-lg leading-relaxed text-foreground max-w-3xl mx-auto">
                      To empower developers by fostering an inclusive and vibrant space where creativity, learning,
                      and community thrive — both online and in the real world.
                    </p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center p-6 bg-gradient-to-br from-brand-blue/10 to-primary/10 rounded-xl">
                      <span className="text-3xl block mb-3">🤝</span>
                      <h4 className="font-semibold text-foreground mb-2">Collaborate</h4>
                      <p className="text-sm text-muted-foreground">Work together on meaningful projects</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-brand-green/10 to-brand-blue/10 rounded-xl">
                      <span className="text-3xl block mb-3">📚</span>
                      <h4 className="font-semibold text-foreground mb-2">Learn</h4>
                      <p className="text-sm text-muted-foreground">Grow your skills with our community</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-brand-green/10 rounded-xl">
                      <span className="text-3xl block mb-3">🚀</span>
                      <h4 className="font-semibold text-foreground mb-2">Ship</h4>
                      <p className="text-sm text-muted-foreground">Launch projects that matter</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "story" && (
                <div className="space-y-6 animate-slide-in">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-4">📖 Our Story</h3>
                  </div>
                  <div className="max-w-4xl mx-auto">
                    <div className="space-y-8">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">💡 The Spark (2024)</h4>
                          <p className="text-muted-foreground">
                            What started as a weekend thought by VVS Basanth Pedapati quickly evolved into something bigger. 
                            The idea was simple: create a space where developers can showcase their work and connect meaningfully.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">🏗️ Building the Foundation</h4>
                          <p className="text-muted-foreground">
                            From a simple GitHub integration to a full-featured platform with dashboards, 
                            project showcases, and community features. Every feature was built with developers in mind.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">🌱 Growing the Community</h4>
                          <p className="text-muted-foreground">
                            Today, func(Kode) is home to developers from around the world, hosting hackathons, 
                            meetups, and collaborative projects that make a real impact.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "vision" && (
                <div className="space-y-6 animate-slide-in">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-4">🔮 Our Vision</h3>
                    <p className="text-lg leading-relaxed text-foreground max-w-3xl mx-auto mb-8">
                      We envision a world where every developer has access to a supportive community, 
                      meaningful projects, and the tools they need to grow.
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <span>🌐</span> Global Reach
                      </h4>
                      <p className="text-muted-foreground">
                        Connecting developers across continents, time zones, and technologies to build amazing things together.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <span>🎓</span> Continuous Learning
                      </h4>
                      <p className="text-muted-foreground">
                        Providing resources, mentorship, and opportunities for developers at every stage of their journey.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <span>🚀</span> Innovation Hub
                      </h4>
                      <p className="text-muted-foreground">
                        Being the launchpad for groundbreaking projects that solve real-world problems.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <span>🤖</span> AI-Powered Tools
                      </h4>
                      <p className="text-muted-foreground">
                        Leveraging AI to help developers debug faster, learn more efficiently, and ship better code.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "community" && (
                <div className="space-y-6 animate-slide-in">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-4">👥 Our Community</h3>
                    <p className="text-lg leading-relaxed text-foreground max-w-3xl mx-auto mb-8">
                      func(Kode) is powered by an amazing community of developers, designers, writers, and dreamers.
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { role: "💻 Developers", count: "50+", desc: "Full-stack, frontend, backend, and mobile developers" },
                      { role: "🎨 Designers", count: "15+", desc: "UI/UX designers making our projects beautiful" },
                      { role: "✍️ Content Creators", count: "20+", desc: "Technical writers and documentation experts" },
                      { role: "🚀 Entrepreneurs", count: "10+", desc: "Building the next generation of startups" },
                      { role: "🎓 Students", count: "30+", desc: "Learning and growing with our community" },
                      { role: "🧠 Mentors", count: "12+", desc: "Experienced developers sharing their knowledge" },
                    ].map((group, index) => (
                      <div key={index} className="bg-card p-6 rounded-xl border hover:shadow-lg transition-shadow duration-200">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-brand-blue mb-1">{group.count}</div>
                          <div className="font-semibold text-foreground mb-2">{group.role}</div>
                          <div className="text-sm text-muted-foreground">{group.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-6 mb-12">
          {[
            {
              id: "features",
              title: "🚀 What We're Building",
              preview: "Explore the features that make func(Kode) special...",
              content: (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <span>📊</span> Personal Dashboard
                    </h4>
                    <p className="text-muted-foreground">
                      Visualize your GitHub activity, track contributions, and see your growth over time.
                    </p>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-brand-blue hover:underline">
                      Explore Dashboard →
                    </Link>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <span>🎨</span> Project Showcase
                    </h4>
                    <p className="text-muted-foreground">
                      Share your coolest projects with the community and get feedback from fellow developers.
                    </p>
                    <Link href="/projects" className="inline-flex items-center gap-2 text-brand-blue hover:underline">
                      View Projects →
                    </Link>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <span>🏆</span> Leaderboard & Achievements
                    </h4>
                    <p className="text-muted-foreground">
                      Compete friendly with other developers and unlock badges as you contribute more.
                    </p>
                    <Link href="/leaderboard" className="inline-flex items-center gap-2 text-brand-blue hover:underline">
                      View Leaderboard →
                    </Link>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <span>🎯</span> Community Events
                    </h4>
                    <p className="text-muted-foreground">
                      Join hackathons, meetups, and coding challenges organized by the community.
                    </p>
                    <Link href="/events" className="inline-flex items-center gap-2 text-brand-blue hover:underline">
                      Upcoming Events →
                    </Link>
                  </div>
                </div>
              )
            },
            {
              id: "hybrid",
              title: "🌍 The Hybrid Experience",
              preview: "Online and offline community experiences...",
              content: (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="text-center p-8 bg-gradient-to-br from-brand-blue/10 to-primary/10 rounded-xl">
                    <span className="text-5xl mb-4 block">🌐</span>
                    <h4 className="text-xl font-semibold mb-4 text-foreground">Online Community</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• GitHub integration & activity tracking</li>
                      <li>• Virtual hackathons & coding challenges</li>
                      <li>• Discussion forums & help channels</li>
                      <li>• Live coding sessions & mentorship</li>
                    </ul>
                    <div className="mt-6 space-y-2">
                      <Link href="/docs" className="block text-brand-blue hover:underline">
                        📚 Documentation Hub
                      </Link>
                      <Link href="/learn" className="block text-brand-blue hover:underline">
                        🎓 Learning Resources
                      </Link>
                    </div>
                  </div>
                  <div className="text-center p-8 bg-gradient-to-br from-brand-green/10 to-brand-blue/10 rounded-xl">
                    <span className="text-5xl mb-4 block">🏙️</span>
                    <h4 className="text-xl font-semibold mb-4 text-foreground">Offline Meetups</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Local meetups in major cities</li>
                      <li>• Coffee & code sessions</li>
                      <li>• In-person hackathons</li>
                      <li>• Tech talks & workshops</li>
                    </ul>
                    <div className="mt-6 space-y-2">
                      <Link href="/events" className="block text-brand-blue hover:underline">
                        🗓️ Event Calendar
                      </Link>
                      <Link href="/rsvp" className="block text-brand-blue hover:underline">
                        📝 RSVP for Events
                      </Link>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: "values",
              title: "💫 Our Values",
              preview: "The principles that guide our community...",
              content: (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { icon: "🤝", title: "Inclusivity", desc: "Everyone is welcome, regardless of skill level or background" },
                    { icon: "🌟", title: "Excellence", desc: "We strive for quality in everything we build and share" },
                    { icon: "🔍", title: "Transparency", desc: "Open source, open communication, open hearts" },
                    { icon: "🚀", title: "Innovation", desc: "Pushing boundaries and exploring new possibilities" },
                    { icon: "🎯", title: "Impact", desc: "Building things that make a real difference" },
                    { icon: "🌱", title: "Growth", desc: "Supporting each other's learning and development" },
                  ].map((value, index) => (
                    <div key={index} className="text-center p-6 bg-card rounded-xl border">
                      <span className="text-3xl block mb-3">{value.icon}</span>
                      <h4 className="font-semibold text-foreground mb-2">{value.title}</h4>
                      <p className="text-sm text-muted-foreground">{value.desc}</p>
                    </div>
                  ))}
                </div>
              )
            }
          ].map((section) => (
            <Card key={section.id} className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 text-left hover:bg-muted/50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-1">{section.title}</h3>
                      <p className="text-muted-foreground">{section.preview}</p>
                    </div>
                    <span className={`transform transition-transform duration-200 ${expandedSection === section.id ? 'rotate-180' : ''}`}>
                      ⌄
                    </span>
                  </div>
                </button>
                {expandedSection === section.id && (
                  <div className="px-6 pb-6 border-t border-border animate-slide-down">
                    <div className="pt-6">
                      {section.content}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-brand-blue/10 via-primary/10 to-brand-green/10">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold text-foreground mb-4">Ready to Join the Movement?</h3>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you&#39;re a seasoned developer or just starting your coding journey, 
                there&#39;s a place for you in our community.
              </p>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Link href="https://github.com/func-Kode/site.git" className="group">
                  <div className="p-4 bg-card rounded-xl border group-hover:shadow-lg transition-shadow duration-200">
                    <span className="text-2xl block mb-2">🚀</span>
                    <div className="font-semibold text-foreground">Join Community</div>
                    <div className="text-xs text-muted-foreground">Start your journey</div>
                  </div>
                </Link>
                <button onClick={handleDashboardClick} className="group text-left">
                  <div className="p-4 bg-card rounded-xl border group-hover:shadow-lg transition-shadow duration-200">
                    <span className="text-2xl block mb-2">📊</span>
                    <div className="font-semibold text-foreground">View Dashboard</div>
                    <div className="text-xs text-muted-foreground">
                      {user ? 'Track your progress' : 'Login to track progress'}
                    </div>
                  </div>
                </button>
                <Link href="/projects" className="group">
                  <div className="p-4 bg-card rounded-xl border group-hover:shadow-lg transition-shadow duration-200">
                    <span className="text-2xl block mb-2">🎨</span>
                    <div className="font-semibold text-foreground">Browse Projects</div>
                    <div className="text-xs text-muted-foreground">Get inspired</div>
                  </div>
                </Link>
                <Link href="/docs" className="group">
                  <div className="p-4 bg-card rounded-xl border group-hover:shadow-lg transition-shadow duration-200">
                    <span className="text-2xl block mb-2">📚</span>
                    <div className="font-semibold text-foreground">Read Docs</div>
                    <div className="text-xs text-muted-foreground">Learn more</div>
                  </div>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg">
                  <Link href="https://github.com/func-Kode/site.git">
                    <span className="mr-2">🚀</span>
                    Join Our Community
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2"
                  onClick={handleDashboardClick}
                >
                  <span className="mr-2">�</span>
                  {user ? 'Explore Dashboard' : 'Login & Explore Dashboard'}
                </Button>
              </div>
              
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="text-xs">💻 Open Source</Badge>
                <Badge variant="secondary" className="text-xs">🌍 Global Community</Badge>
                <Badge variant="secondary" className="text-xs">🚀 Always Improving</Badge>
                <Badge variant="secondary" className="text-xs">❤️ Made with Love</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}