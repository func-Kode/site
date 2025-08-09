"use client";
import { useState, useEffect, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Users, 
  UserX, 
  Mail, 
  Phone, 
  Github, 
  Settings,
  CheckCircle,
  XCircle,
  Star,
  Eye,
  Calendar,
  FileText,
  Folder,
  MessageSquare
} from "lucide-react";

interface RSVPResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  github_username: string;
  role: string;
  goals: string[];
  attendance_type: string;
  comments: string | null;
  created_at: string;
  user_id: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string;
  author_name: string;
  is_approved: boolean;
  is_featured: boolean;
  views_count: number;
  created_at: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  is_upcoming: boolean;
  max_attendees: number;
  created_at: string;
}

const ADMIN_EMAILS = ["vvs.pedapati@rediffmail.com"];
const ADMIN_GITHUB_USERNAMES = ["basanth-pedapati"];

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rsvpResponses, setRsvpResponses] = useState<RSVPResponse[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const supabase = createClientComponentClient();

  const fetchAllData = useCallback(async () => {
    try {
      // Fetch RSVP responses
      const { data: rsvpData } = await supabase
        .from('rsvp_responses')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch projects
      const { data: projectData } = await supabase
        .from('projects')
        .select('id, title, description, author_name, is_approved, is_featured, views_count, created_at')
        .order('created_at', { ascending: false });

      // Fetch events
      const { data: eventData } = await supabase
        .from('events')
        .select('id, name, date, is_upcoming, max_attendees, created_at')
        .order('created_at', { ascending: false });

      setRsvpResponses(rsvpData || []);
      setProjects(projectData || []);
      setEvents(eventData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    // Check authentication and admin status
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      const userEmail = data.user?.email;
      const githubUsername = data.user?.user_metadata?.github_username;
      
      const isUserAdmin = ADMIN_EMAILS.includes(userEmail || "") || 
                         ADMIN_GITHUB_USERNAMES.includes(githubUsername || "");
      
      setIsAdmin(isUserAdmin);
      
      if (isUserAdmin) {
        fetchAllData();
      } else {
        setLoading(false);
      }
    });
  }, [fetchAllData, supabase.auth]);

  const updateProjectStatus = async (projectId: string, updates: { is_approved?: boolean; is_featured?: boolean }) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId);

      if (error) {
        console.error('Error updating project:', error);
        return;
      }

      // Refresh projects
      const { data: projectData } = await supabase
        .from('projects')
        .select('id, title, description, author_name, is_approved, is_featured, views_count, created_at')
        .order('created_at', { ascending: false });
      
      setProjects(projectData || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <UserX className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground">Please log in to access the admin dashboard.</p>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <UserX className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don&apos;t have permission to access this admin dashboard.
          </p>
        </Card>
      </div>
    );
  }

  const pendingProjects = projects.filter(p => !p.is_approved);
  const approvedProjects = projects.filter(p => p.is_approved);
  const featuredProjects = projects.filter(p => p.is_featured);

  const stats = {
    totalRSVPs: rsvpResponses.length,
    totalProjects: projects.length,
    pendingProjects: pendingProjects.length,
    approvedProjects: approvedProjects.length,
    featuredProjects: featuredProjects.length,
    totalEvents: events.length,
    upcomingEvents: events.filter(e => e.is_upcoming).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage projects, events, RSVPs and content</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 border-b-2 font-medium ${
              activeTab === "overview" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 border-b-2 font-medium ${
              activeTab === "projects" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Projects ({pendingProjects.length} pending)
          </button>
          <button
            onClick={() => setActiveTab("rsvps")}
            className={`px-4 py-2 border-b-2 font-medium ${
              activeTab === "rsvps" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            RSVPs
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Folder className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                    <p className="text-2xl font-bold">{stats.totalProjects}</p>
                    <p className="text-xs text-muted-foreground">{stats.pendingProjects} pending approval</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Events</p>
                    <p className="text-2xl font-bold">{stats.totalEvents}</p>
                    <p className="text-xs text-muted-foreground">{stats.upcomingEvents} upcoming</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">RSVPs</p>
                    <p className="text-2xl font-bold">{stats.totalRSVPs}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Featured</p>
                    <p className="text-2xl font-bold">{stats.featuredProjects}</p>
                    <p className="text-xs text-muted-foreground">projects featured</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="w-6 h-6 text-blue-500" />
                  <h3 className="font-semibold">Project Management</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Review and approve submitted projects, feature them on the homepage.
                </p>
                <Link href="/admin/projects">
                  <Button className="w-full">Manage Projects</Button>
                </Link>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-green-500" />
                  <h3 className="font-semibold">Event Management</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Create and manage events, view attendee registrations.
                </p>
                <Button className="w-full" variant="outline" disabled>
                  Coming Soon
                </Button>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-purple-500" />
                  <h3 className="font-semibold">Content Management</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage blog posts, documentation, and site content.
                </p>
                <Button className="w-full" variant="outline" disabled>
                  Coming Soon
                </Button>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-indigo-500" />
                  <h3 className="font-semibold">Community</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Join our Discord community for discussions and support.
                </p>
                <Button asChild className="w-full" variant="outline">
                  <a href="https://discord.gg/nnkA8xJ3JU" target="_blank" rel="noopener noreferrer">
                    Join Discord
                  </a>
                </Button>
              </Card>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            {projects.length === 0 ? (
              <Card className="p-8 text-center">
                <Folder className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Projects</h3>
                <p className="text-muted-foreground">No projects have been submitted yet.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Pending Projects */}
                {pendingProjects.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-orange-600">
                      Pending Approval ({pendingProjects.length})
                    </h3>
                    <div className="space-y-4">
                      {pendingProjects.map((project) => (
                        <Card key={project.id} className="p-4 border-orange-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold">{project.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>By: {project.author_name}</span>
                                <span>{new Date(project.created_at).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {project.views_count}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateProjectStatus(project.id, { is_approved: true })}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateProjectStatus(project.id, { is_featured: !project.is_featured })}
                              >
                                <Star className="w-4 h-4 mr-1" />
                                {project.is_featured ? "Unfeature" : "Feature"}
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Approved Projects */}
                {approvedProjects.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-green-600">
                      Approved Projects ({approvedProjects.length})
                    </h3>
                    <div className="space-y-4">
                      {approvedProjects.map((project) => (
                        <Card key={project.id} className="p-4 border-green-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{project.title}</h4>
                                {project.is_featured && (
                                  <Badge className="bg-yellow-100 text-yellow-800">
                                    <Star className="w-3 h-3 mr-1" />
                                    Featured
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>By: {project.author_name}</span>
                                <span>{new Date(project.created_at).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {project.views_count}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateProjectStatus(project.id, { is_approved: false })}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Unapprove
                              </Button>
                              <Button
                                size="sm"
                                variant={project.is_featured ? "secondary" : "outline"}
                                onClick={() => updateProjectStatus(project.id, { is_featured: !project.is_featured })}
                              >
                                <Star className="w-4 h-4 mr-1" />
                                {project.is_featured ? "Unfeature" : "Feature"}
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* RSVPs Tab */}
        {activeTab === "rsvps" && (
          <div className="space-y-6">
            {rsvpResponses.length === 0 ? (
              <Card className="p-8 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No RSVPs</h3>
                <p className="text-muted-foreground">No one has RSVP&apos;d yet.</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {rsvpResponses.slice(0, 10).map((response) => (
                  <Card key={response.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{response.name}</h4>
                          <Badge variant={response.attendance_type === 'virtual' ? 'secondary' : 'default'}>
                            {response.attendance_type}
                          </Badge>
                          <Badge variant="outline">{response.role}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {response.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {response.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Github className="w-3 h-3" />
                            {response.github_username || 'Not provided'}
                          </span>
                        </div>
                        {response.goals.length > 0 && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {response.goals.map((goal, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {goal}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(response.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
