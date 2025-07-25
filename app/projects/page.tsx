"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Github,
  ExternalLink,
  Star,
  GitFork,
  Code,
  Users,
  Search,
  Rocket,
  Heart,
  TrendingUp,
  Clock,
  Award
} from "lucide-react";

type Project = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  githubUrl: string;
  liveUrl?: string;
  tags: string[];
  language: string;
  stars: number;
  forks: number;
  watchers: number;
  lastUpdated: Date;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: "Web App" | "Mobile App" | "CLI Tool" | "Library" | "Game" | "AI/ML";
  featured: boolean;
  contributors: number;
};

const projects: Project[] = [
  {
    id: "1",
    title: "Code Snippet Manager",
    description: "Organize and share your favorite code snippets with syntax highlighting and search.",
    longDescription: "A comprehensive code snippet management tool built with Next.js and Supabase. Features include syntax highlighting, tagging, search functionality, and collaborative sharing.",
    image: "/projects/snippet-manager.svg",
    githubUrl: "https://github.com/funckode/snippet-manager",
    liveUrl: "https://snippets.funckode.com",
    tags: ["React", "Next.js", "Supabase", "TypeScript", "Tailwind"],
    language: "TypeScript",
    stars: 234,
    forks: 45,
    watchers: 12,
    lastUpdated: new Date("2024-12-15"),
    author: {
      name: "Basanth Kumar",
      avatar: "/avatars/basanth.svg",
      username: "basanth"
    },
    difficulty: "Intermediate",
    category: "Web App",
    featured: true,
    contributors: 8
  },
  {
    id: "2",
    title: "DevTools CLI",
    description: "A powerful command-line interface for common development tasks and project scaffolding.",
    longDescription: "Streamline your development workflow with this comprehensive CLI tool. Includes project templates, code generators, and automation scripts.",
    image: "/projects/devtools-cli.svg",
    githubUrl: "https://github.com/funckode/devtools-cli",
    tags: ["Node.js", "CLI", "JavaScript", "Automation"],
    language: "JavaScript",
    stars: 156,
    forks: 23,
    watchers: 8,
    lastUpdated: new Date("2024-12-10"),
    author: {
      name: "Sarah Chen",
      avatar: "/avatars/sarahc.svg",
      username: "sarahc"
    },
    difficulty: "Advanced",
    category: "CLI Tool",
    featured: true,
    contributors: 5
  },
  {
    id: "3",
    title: "React Component Library",
    description: "A modern, accessible React component library with TypeScript support.",
    longDescription: "Build beautiful UIs faster with this comprehensive component library. Features dark mode, accessibility, and extensive customization options.",
    image: "/projects/react-components.svg",
    githubUrl: "https://github.com/funckode/react-components",
    liveUrl: "https://components.funckode.com",
    tags: ["React", "TypeScript", "Storybook", "CSS-in-JS"],
    language: "TypeScript",
    stars: 89,
    forks: 15,
    watchers: 6,
    lastUpdated: new Date("2024-12-08"),
    author: {
      name: "Alex Rodriguez",
      avatar: "/avatars/alexr.svg",
      username: "alexr"
    },
    difficulty: "Intermediate",
    category: "Library",
    featured: false,
    contributors: 12
  },
  {
    id: "4",
    title: "AI Code Assistant",
    description: "An intelligent code completion and suggestion tool powered by machine learning.",
    longDescription: "Enhance your coding experience with AI-powered suggestions, code completion, and intelligent refactoring recommendations.",
    image: "/projects/ai-assistant.svg",
    githubUrl: "https://github.com/funckode/ai-assistant",
    tags: ["Python", "Machine Learning", "AI", "VSCode Extension"],
    language: "Python",
    stars: 312,
    forks: 67,
    watchers: 18,
    lastUpdated: new Date("2024-12-12"),
    author: {
      name: "Dr. Emily Watson",
      avatar: "/avatars/emilyw.svg",
      username: "emilyw"
    },
    difficulty: "Advanced",
    category: "AI/ML",
    featured: true,
    contributors: 15
  },
  {
    id: "5",
    title: "Mobile Task Manager",
    description: "A cross-platform mobile app for task management with offline support.",
    longDescription: "Stay organized with this feature-rich task management app. Includes offline sync, team collaboration, and smart notifications.",
    image: "/projects/task-manager.svg",
    githubUrl: "https://github.com/funckode/task-manager",
    liveUrl: "https://tasks.funckode.com",
    tags: ["React Native", "Expo", "SQLite", "Push Notifications"],
    language: "JavaScript",
    stars: 178,
    forks: 34,
    watchers: 9,
    lastUpdated: new Date("2024-12-05"),
    author: {
      name: "Mike Johnson",
      avatar: "/avatars/mikej.svg",
      username: "mikej"
    },
    difficulty: "Intermediate",
    category: "Mobile App",
    featured: false,
    contributors: 6
  },
  {
    id: "6",
    title: "Code Golf Challenge",
    description: "A fun coding game where developers compete to write the shortest code solutions.",
    longDescription: "Challenge yourself and others with programming puzzles. Features leaderboards, multiple languages, and daily challenges.",
    image: "/projects/code-golf.svg",
    githubUrl: "https://github.com/funckode/code-golf",
    liveUrl: "https://golf.funckode.com",
    tags: ["Vue.js", "Node.js", "Socket.io", "MongoDB"],
    language: "JavaScript",
    stars: 95,
    forks: 19,
    watchers: 4,
    lastUpdated: new Date("2024-11-28"),
    author: {
      name: "Lisa Park",
      avatar: "/avatars/lisap.svg",
      username: "lisap"
    },
    difficulty: "Beginner",
    category: "Game",
    featured: false,
    contributors: 3
  }
];
const
  categories = ["All", "Web App", "Mobile App", "CLI Tool", "Library", "Game", "AI/ML"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "All" || project.difficulty === selectedDifficulty;
      const matchesFeatured = !showFeaturedOnly || project.featured;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesFeatured;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty, showFeaturedOnly]);

  const featuredProjects = projects.filter(project => project.featured);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto container-mobile py-8 md:py-12 safe-bottom">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-brand-blue to-primary rounded-xl flex items-center justify-center">
              <Rocket className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-brand-blue to-primary bg-clip-text text-transparent">
              Projects
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover amazing projects built by our community. From web apps to AI tools,
            find inspiration and contribute to open-source innovation.
          </p>
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Award className="w-6 h-6 text-brand-green" />
              <h2 className="text-2xl font-bold text-foreground">Featured Projects</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {featuredProjects.slice(0, 3).map((project) => (
                <Card key={project.id} className="group card-hover border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
                  <div className="relative overflow-hidden rounded-t-xl">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-brand-green text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className={getDifficultyColor(project.difficulty)}>
                        {project.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {project.category}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-2 mb-4">
                      <Image
                        src={project.author.avatar}
                        alt={project.author.name}
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-muted-foreground">
                        by {project.author.name}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {project.stars}
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-4 h-4" />
                        {project.forks}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {project.contributors}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="flex-1">
                        <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </Link>
                      </Button>
                      {project.liveUrl && (
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Live
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <section className="mb-12">
          <Card className="p-6 border-0 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search projects, tags, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Difficulty Filter */}
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <Button
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className="text-xs"
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>

              {/* Featured Toggle */}
              <Button
                variant={showFeaturedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                className="flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                Featured Only
              </Button>
            </div>
          </Card>
        </section>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-muted-foreground">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>Sorted by popularity</span>
          </div>
        </div>

        {/* All Projects Grid */}
        <section>
          {filteredProjects.length === 0 ? (
            <Card className="p-12 text-center border-0 shadow-lg">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">No projects found</h3>
                <p className="text-muted-foreground max-w-md">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSelectedDifficulty("All");
                    setShowFeaturedOnly(false);
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <Card
                  key={project.id}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden rounded-t-xl">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className={getDifficultyColor(project.difficulty)}>
                        {project.difficulty}
                      </Badge>
                    </div>
                    {project.featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-brand-green text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <Badge variant="outline" className="text-xs ml-2 shrink-0">
                        {project.category}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
                      {project.description}
                    </p>

                    {/* Author & Date */}
                    <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Image
                          src={project.author.avatar}
                          alt={project.author.name}
                          width={20}
                          height={20}
                          className="w-5 h-5 rounded-full"
                        />
                        <span>{project.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(project.lastUpdated)}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {project.stars}
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        {project.forks}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {project.contributors}
                      </div>
                      <div className="flex items-center gap-1">
                        <Code className="w-3 h-3" />
                        {project.language}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="flex-1 text-xs">
                        <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-3 h-3 mr-1" />
                          Code
                        </Link>
                      </Button>
                      {project.liveUrl && (
                        <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
                          <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Live
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="mt-20">
          <Card className="p-8 md:p-12 text-center border-0 shadow-xl bg-gradient-to-r from-primary/5 to-brand-blue/5">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-green to-brand-green/80 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Share Your Project
                </h2>
              </div>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Built something amazing? Share it with our community! Whether it's a weekend project
                or your next big idea, we'd love to see what you've created.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-brand-green to-brand-green/80">
                  <Link href="/submit-project">
                    <Rocket className="w-5 h-5 mr-2" />
                    Submit Project
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/about">
                    <Users className="w-5 h-5 mr-2" />
                    Join Community
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}