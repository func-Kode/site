"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
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
import Script from "next/script";

type Project = {
  id: string;
  title: string;
  description: string;
  long_description: string;
  github_url: string;
  live_url?: string;
  tags: string[];
  language: string;
  category: "Web App" | "Mobile App" | "CLI Tool" | "Library" | "Game" | "AI/ML";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  author_name: string;
  author_email: string;
  user_id: string;
  is_featured: boolean;
  is_approved: boolean;
  views_count?: number;
  likes_count?: number;
  created_at: string;
  updated_at: string;
};

const categories = ["All", "Web App", "Mobile App", "CLI Tool", "Library", "Game", "AI/ML"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch projects');
        }
        
        setProjects(data.projects || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "All" || project.difficulty === selectedDifficulty;
      const matchesFeatured = !showFeaturedOnly || project.is_featured;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesFeatured;
    });
  }, [projects, searchTerm, selectedCategory, selectedDifficulty, showFeaturedOnly]);

  const featuredProjects = projects.filter(project => project.is_featured);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto container-mobile py-8 md:py-12 safe-bottom">
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
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto container-mobile py-8 md:py-12 safe-bottom">
          <div className="text-center mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-brand-blue to-primary rounded-xl flex items-center justify-center">
                <Rocket className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-brand-blue to-primary bg-clip-text text-transparent">
                Projects
              </h1>
            </div>
          </div>
          <Card className="p-12 text-center border-0 shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <ExternalLink className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Failed to load projects</h3>
              <p className="text-muted-foreground max-w-md">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-background to-muted/20">
      <Script id="ld-projects" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Open‑Source Projects – funcKode',
          url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://func-kode.netlify.app') + '/projects',
        })}
      </Script>
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
                    <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <Code className="w-16 h-16 text-muted-foreground" />
                    </div>
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
                      <div className="w-6 h-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                        <Users className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        by {project.author_name}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {project.likes_count || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-4 h-4" />
                        0
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        1
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
                        <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </Link>
                      </Button>
                      {project.live_url && (
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link href={project.live_url} target="_blank" rel="noopener noreferrer">
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
                  Try adjusting your search terms or filters to find what you&#39;re looking for.
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
                    <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:from-primary/15 group-hover:to-secondary/15 transition-colors duration-300">
                      <Code className="w-16 h-16 text-muted-foreground" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className={getDifficultyColor(project.difficulty)}>
                        {project.difficulty}
                      </Badge>
                    </div>
                    {project.is_featured && (
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
                        <div className="w-5 h-5 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                          <Users className="w-3 h-3" />
                        </div>
                        <span>{project.author_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(project.created_at)}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {project.likes_count || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        0
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        1
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
                        <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="w-3 h-3 mr-1" />
                          Code
                        </Link>
                      </Button>
                      {project.live_url && (
                        <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
                          <Link href={project.live_url} target="_blank" rel="noopener noreferrer">
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
                Built something amazing? Share it with our community! Whether it&#39;s a weekend project
                or your next big idea, we&#39;d love to see what you&#39;ve created.
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