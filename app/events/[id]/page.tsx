"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Github, 
  ArrowLeft,
  Trophy,
  Code,
  Coffee,
  Sparkles,
  Share2,
  Heart,
  MessageCircle
} from "lucide-react";
import { notFound } from "next/navigation";

// Event type (same as in events page)
type Event = {
  id: string;
  name: string;
  date: Date;
  time: string;
  description: string;
  longDescription: string;
  registrationLink: string;
  isUpcoming: boolean;
  isCommunityEvent: boolean;
  location: string;
  attendees: number;
  maxAttendees: number;
  tags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: "Workshop" | "Hackathon" | "Meetup" | "Conference" | "Sprint";
  prizes?: string[];
  agenda?: { time: string; activity: string; speaker?: string }[];
  requirements?: string[];
  whatYouWillLearn?: string[];
  speakers?: { name: string; role: string; bio: string; avatar?: string }[];
};

// Mock events data (in a real app, this would come from an API/database)
const events: Event[] = [
  {
    id: "1",
    name: "Ship in an hour (#1)",
    date: new Date(2025, 7, 2),
    time: "1:30 PM - 5:30 PM",
    description: "Join our open-source sprint! Build a fun project, share on GitHub, and win badges.",
    longDescription: "A fast-paced coding sprint where developers come together to build, ship, and showcase amazing projects in just one hour. Whether you're a beginner or expert, this event is designed to push your creativity and coding skills to the limit. You'll work in teams or solo to create something awesome, deploy it, and present it to the community.",
    registrationLink: "https://github.com/orgs/func-Kode/discussions/19",
    isUpcoming: true,
    isCommunityEvent: true,
    location: "Online & Local Hubs",
    attendees: 47,
    maxAttendees: 100,
    tags: ["Open Source", "Sprint", "GitHub", "Collaboration"],
    difficulty: "Intermediate",
    type: "Sprint",
    prizes: ["GitHub Pro", "func(Kode) Swag", "Featured Project Showcase"],
    agenda: [
      { time: "1:30 PM", activity: "Welcome & Team Formation" },
      { time: "2:00 PM", activity: "Sprint Begins - Start Building!" },
      { time: "3:00 PM", activity: "Check-in & Progress Updates" },
      { time: "4:00 PM", activity: "Final Push & Deployment" },
      { time: "4:30 PM", activity: "Project Presentations" },
      { time: "5:15 PM", activity: "Awards & Closing" }
    ],
    requirements: [
      "Basic programming knowledge",
      "GitHub account",
      "Development environment setup",
      "Enthusiasm to build and learn!"
    ],
    whatYouWillLearn: [
      "Rapid prototyping techniques",
      "Time management in development",
      "Deployment strategies",
      "Presentation skills",
      "Collaborative coding"
    ]
  },
  {
    id: "2",
    name: "Coffee & Code Morning",
    date: new Date(2025, 7, 15),
    time: "9:00 AM - 11:00 AM",
    description: "Casual morning meetup for developers to network, share ideas, and code together.",
    longDescription: "Start your day right with fellow developers! Bring your laptop, grab some coffee, and join us for a relaxed coding session. Perfect for networking, getting help with projects, or just enjoying the company of like-minded developers.",
    registrationLink: "https://github.com/orgs/func-Kode/discussions/20",
    isUpcoming: true,
    isCommunityEvent: true,
    location: "Tech Hub Downtown",
    attendees: 23,
    maxAttendees: 50,
    tags: ["Networking", "Coffee", "Casual", "Morning"],
    difficulty: "Beginner",
    type: "Meetup",
    agenda: [
      { time: "9:00 AM", activity: "Coffee & Networking" },
      { time: "9:30 AM", activity: "Lightning Talks (5 min each)" },
      { time: "10:00 AM", activity: "Open Coding Session" },
      { time: "10:45 AM", activity: "Wrap-up & Next Steps" }
    ],
    requirements: [
      "Bring your laptop",
      "Any skill level welcome",
      "Positive attitude"
    ]
  }
];

interface EventPageProps {
  params: {
    id: string;
  };
}

export default function EventPage({ params }: EventPageProps) {
  const event = events.find(e => e.id === params.id);

  if (!event) {
    notFound();
  }

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'Workshop': return <Code className="w-6 h-6" />;
      case 'Hackathon': return <Trophy className="w-6 h-6" />;
      case 'Meetup': return <Coffee className="w-6 h-6" />;
      case 'Sprint': return <Sparkles className="w-6 h-6" />;
      default: return <Calendar className="w-6 h-6" />;
    }
  };

  const getDifficultyColor = (difficulty: Event['difficulty']) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="hover:bg-muted">
            <Link href="/events" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <Card className="border-0 shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-brand-blue to-primary p-8 text-white">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    {getEventIcon(event.type)}
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-white/80">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span className="text-lg">{format(event.date, "EEEE, MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span className="text-lg">{event.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-xl text-white/90 leading-relaxed mb-6">
                  {event.longDescription}
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">
                    {event.type}
                  </Badge>
                  <Badge className={`${getDifficultyColor(event.difficulty)} text-sm px-3 py-1`}>
                    {event.difficulty}
                  </Badge>
                  {event.isUpcoming && (
                    <Badge className="bg-brand-green text-white text-sm px-3 py-1">
                      Upcoming
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="lg:w-80">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3 text-white">
                      <MapPin className="w-5 h-5" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <Users className="w-5 h-5" />
                      <span>{event.attendees}/{event.maxAttendees} attendees</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div 
                        className="bg-brand-green h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex flex-col gap-3 pt-4">
                      <Button asChild className="bg-white text-brand-blue hover:bg-white/90 w-full">
                        <Link href={event.registrationLink} target="_blank" className="flex items-center gap-2">
                          <Github className="w-4 h-4" />
                          Register Now
                        </Link>
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 flex-1">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 flex-1">
                          <Heart className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tags */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Topics</h2>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Agenda */}
            {event.agenda && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-blue" />
                    Event Agenda
                  </h2>
                  <div className="space-y-4">
                    {event.agenda.map((item, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                        <div className="w-20 text-sm font-mono text-brand-blue font-semibold">
                          {item.time}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{item.activity}</p>
                          {item.speaker && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Speaker: {item.speaker}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* What You'll Learn */}
            {event.whatYouWillLearn && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-green" />
                    What You&#39;ll Learn
                  </h2>
                  <ul className="space-y-3">
                    {event.whatYouWillLearn.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-brand-green rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Prizes */}
            {event.prizes && (
              <Card className="border-0 shadow-lg bg-gradient-to-r from-brand-green/5 to-brand-green/10">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-brand-green" />
                    Prizes & Rewards
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {event.prizes.map((prize, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                        <div className="w-8 h-8 bg-brand-green/20 rounded-full flex items-center justify-center">
                          <span className="text-brand-green font-bold text-sm">#{index + 1}</span>
                        </div>
                        <span className="text-foreground font-medium">{prize}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Requirements */}
            {event.requirements && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Requirements</h3>
                  <ul className="space-y-2">
                    {event.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-brand-blue rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Community Engagement */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Join the Discussion</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href={event.registrationLink} target="_blank">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      GitHub Discussions
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/about">
                      <Users className="w-4 h-4 mr-2" />
                      Join Community
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Related Events */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-foreground">More Events</h3>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/events">
                    <Calendar className="w-4 h-4 mr-2" />
                    View All Events
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}