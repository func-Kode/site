"use client";
import { useState, useEffect, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    CheckCircle, 
    XCircle, 
    Star, 
    Eye, 
    Github, 
    ExternalLink,
    Users,
    Settings
} from "lucide-react";

interface Project {
    id: string;
    title: string;
    description: string;
    long_description: string;
    github_url: string;
    live_url?: string;
    tags: string[];
    language: string;
    category: string;
    difficulty: string;
    author_name: string;
    author_email: string;
    user_id: string;
    is_featured: boolean;
    is_approved: boolean;
    views_count: number;
    likes_count: number;
    created_at: string;
}

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const supabase = createClientComponentClient();

    const fetchProjects = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching projects:', error);
                return;
            }

            setProjects(data || []);
        } catch (error) {
            console.error('Error:', error);
        }
    }, [supabase]);

    const checkAdminStatus = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            setLoading(false);
            return;
        }

        // Check if user is admin (you can modify this logic based on your admin system)
        const isUserAdmin = user.email === 'vvs.pedapati@rediffmail.com' || 
                           user.user_metadata?.github_username === 'basanth-pedapati';
        
        setIsAdmin(isUserAdmin);
        
        if (isUserAdmin) {
            await fetchProjects();
        }
        
        setLoading(false);
    }, [supabase, fetchProjects]);

    useEffect(() => {
        checkAdminStatus();
    }, [checkAdminStatus]);

    const updateProjectStatus = async (projectId: string, updates: Partial<Project>) => {
        try {
            const { error } = await supabase
                .from('projects')
                .update(updates)
                .eq('id', projectId);

            if (error) {
                console.error('Error updating project:', error);
                return;
            }

            // Refresh projects list
            await fetchProjects();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="container mx-auto py-8">
                <Card className="text-center p-8">
                    <CardContent>
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                        <p className="text-muted-foreground">
                            You don&apos;t have permission to access this page.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center gap-3 mb-8">
                <Settings className="w-8 h-8 text-brand-blue" />
                <h1 className="text-3xl font-bold">Project Management</h1>
            </div>

            {projects.length === 0 ? (
                <Card className="text-center p-8">
                    <CardContent>
                        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
                        <p className="text-muted-foreground">
                            No projects have been submitted yet. Projects will appear here once users start submitting them.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {projects.map((project) => (
                        <Card key={project.id} className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold">{project.title}</h3>
                                        <Badge variant={project.is_approved ? "default" : "secondary"}>
                                            {project.is_approved ? "Approved" : "Pending"}
                                        </Badge>
                                        {project.is_featured && (
                                            <Badge className="bg-yellow-100 text-yellow-800">
                                                <Star className="w-3 h-3 mr-1" />
                                                Featured
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground mb-2">{project.description}</p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                        <span>By: {project.author_name}</span>
                                        <span>Language: {project.language}</span>
                                        <span>Category: {project.category}</span>
                                        <span>Difficulty: {project.difficulty}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {project.tags.map((tag, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Eye className="w-4 h-4" />
                                    {project.views_count}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    <Button asChild size="sm" variant="outline">
                                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                            <Github className="w-4 h-4 mr-2" />
                                            GitHub
                                        </a>
                                    </Button>
                                    {project.live_url && (
                                        <Button asChild size="sm" variant="outline">
                                            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                Live Demo
                                            </a>
                                        </Button>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {!project.is_approved && (
                                        <Button
                                            size="sm"
                                            onClick={() => updateProjectStatus(project.id, { is_approved: true })}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Approve
                                        </Button>
                                    )}
                                    {project.is_approved && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => updateProjectStatus(project.id, { is_approved: false })}
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Unapprove
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant={project.is_featured ? "secondary" : "outline"}
                                        onClick={() => updateProjectStatus(project.id, { is_featured: !project.is_featured })}
                                    >
                                        <Star className="w-4 h-4 mr-2" />
                                        {project.is_featured ? "Unfeature" : "Feature"}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
