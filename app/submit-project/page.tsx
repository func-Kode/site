// import { Badge } from "@/components/ui/badge";
"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
    Rocket,
    Github,
    ExternalLink,
    Tag,
    User,
    Code,
    FileText,
    CheckCircle,
    AlertCircle
} from "lucide-react";

export default function SubmitProjectPage() {
    // Helper function to safely handle string operations
    const safeString = (value: unknown): string => {
        return typeof value === 'string' ? value : '';
    };

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        longDescription: "",
        githubUrl: "",
        liveUrl: "",
        tags: "",
        language: "",
        category: "Web App",
        difficulty: "Intermediate",
        authorName: "",
        authorEmail: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const categories = ["Web App", "Mobile App", "CLI Tool", "Library", "Game", "AI/ML"];
    const difficulties = ["Beginner", "Intermediate", "Advanced"];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: safeString(value) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            setErrorMessage('');

            // Validate required fields
            const requiredFields = ['title', 'description', 'longDescription', 'githubUrl', 'language', 'authorName', 'authorEmail'];
            const missingFields = requiredFields.filter(field => !safeString(formData[field as keyof typeof formData]).trim());

            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            // Process tags safely
            const tagsString = safeString(formData.tags).trim();
            const processedTags = tagsString
                ? tagsString.split(',').map(tag => safeString(tag).trim()).filter(Boolean)
                : [];

            if (processedTags.length === 0) {
                throw new Error('At least one tag is required');
            }

            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    tags: processedTags
                }),
            });

            if (response.ok) {
                setSubmitStatus('success');
                // Reset form on successful submission
                setFormData({
                    title: "",
                    description: "",
                    longDescription: "",
                    githubUrl: "",
                    liveUrl: "",
                    tags: "",
                    language: "",
                    category: "Web App",
                    difficulty: "Intermediate",
                    authorName: "",
                    authorEmail: ""
                });
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Submission failed:', errorData);
                setErrorMessage(errorData.message || 'Failed to submit project. Please try again.');
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="container mx-auto container-mobile py-8 md:py-12 max-w-4xl safe-bottom">
                {/* Header */}
                <div className="text-center mb-8 md:mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-brand-green to-brand-green/80 rounded-xl flex items-center justify-center">
                            <Rocket className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-brand-green to-primary bg-clip-text text-transparent">
                            Submit Your Project
                        </h1>
                    </div>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Share your amazing project with the func(Kode) community! Whether it&#39;s a weekend hack
                        or your next big idea, we&#39;d love to showcase your work.
                    </p>
                </div>

                {/* Submission Status */}
                {submitStatus === 'success' && (
                    <Card className="mb-8 border-green-200 bg-green-50 dark:bg-green-900/20">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <div>
                                    <h3 className="font-semibold text-green-800 dark:text-green-200">Project Submitted Successfully!</h3>
                                    <p className="text-green-700 dark:text-green-300">
                                        Thank you for sharing your project. Our team will review it and add it to the showcase soon.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {submitStatus === 'error' && (
                    <Card className="mb-8 border-red-200 bg-red-50 dark:bg-red-900/20">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                                <div>
                                    <h3 className="font-semibold text-red-800 dark:text-red-200">Submission Failed</h3>
                                    <p className="text-red-700 dark:text-red-300">
                                        {errorMessage || 'There was an error submitting your project. Please try again later.'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Submission Form */}
                <Card className="border-0 shadow-xl card-hover">
                    <CardHeader className="pb-4 md:pb-6 px-4 md:px-6">
                        <CardTitle className="text-xl md:text-2xl font-bold text-foreground">Project Details</CardTitle>
                        <p className="text-sm md:text-base text-muted-foreground">
                            Fill out the form below to submit your project for review and inclusion in our showcase.
                        </p>
                    </CardHeader>
                    <CardContent className="px-4 md:px-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Project Title *
                                    </Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="My Awesome Project"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="language" className="flex items-center gap-2">
                                        <Code className="w-4 h-4" />
                                        Primary Language *
                                    </Label>
                                    <Input
                                        id="language"
                                        name="language"
                                        value={formData.language}
                                        onChange={handleInputChange}
                                        placeholder="JavaScript, Python, TypeScript..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Short Description *</Label>
                                <Input
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="A brief one-line description of your project"
                                    required
                                />
                            </div>

                            {/* Long Description */}
                            <div className="space-y-2">
                                <Label htmlFor="longDescription">Detailed Description *</Label>
                                <textarea
                                    id="longDescription"
                                    name="longDescription"
                                    value={formData.longDescription}
                                    onChange={handleInputChange}
                                    placeholder="Provide a detailed description of your project, its features, and what makes it special..."
                                    className="w-full min-h-[120px] px-3 py-2 border border-input bg-background rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    required
                                />
                            </div>

                            {/* URLs */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="githubUrl" className="flex items-center gap-2">
                                        <Github className="w-4 h-4" />
                                        GitHub URL *
                                    </Label>
                                    <Input
                                        id="githubUrl"
                                        name="githubUrl"
                                        type="url"
                                        value={formData.githubUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://github.com/username/project"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="liveUrl" className="flex items-center gap-2">
                                        <ExternalLink className="w-4 h-4" />
                                        Live Demo URL
                                    </Label>
                                    <Input
                                        id="liveUrl"
                                        name="liveUrl"
                                        type="url"
                                        value={formData.liveUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://myproject.com (optional)"
                                    />
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <Label htmlFor="tags" className="flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    Technologies & Tags *
                                </Label>
                                <Input
                                    id="tags"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    placeholder="React, Node.js, MongoDB, API, etc. (comma-separated)"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Separate multiple tags with commas. These help users discover your project.
                                </p>
                            </div>

                            {/* Category and Difficulty */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        required
                                    >
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="difficulty">Difficulty Level *</Label>
                                    <select
                                        id="difficulty"
                                        name="difficulty"
                                        value={formData.difficulty}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        required
                                    >
                                        {difficulties.map(difficulty => (
                                            <option key={difficulty} value={difficulty}>{difficulty}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Author Information */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Author Information
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="authorName">Your Name *</Label>
                                        <Input
                                            id="authorName"
                                            name="authorName"
                                            value={formData.authorName}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="authorEmail">Your Email *</Label>
                                        <Input
                                            id="authorEmail"
                                            name="authorEmail"
                                            type="email"
                                            value={formData.authorEmail}
                                            onChange={handleInputChange}
                                            placeholder="john@example.com"
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            We&#39;ll use this to contact you about your submission. Not displayed publicly.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-6">
                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={isSubmitting}
                                    className="bg-gradient-to-r from-brand-green to-brand-green/80 hover:shadow-lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Rocket className="w-4 h-4 mr-2" />
                                            Submit Project
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Guidelines */}
                <Card className="mt-8 border-0 shadow-lg bg-muted/50">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Submission Guidelines</h3>
                        <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                            <div>
                                <h4 className="font-medium text-foreground mb-2">✅ What we love to see:</h4>
                                <ul className="space-y-1">
                                    <li>• Open source projects with clear documentation</li>
                                    <li>• Innovative solutions to real problems</li>
                                    <li>• Well-structured code and good practices</li>
                                    <li>• Projects that inspire and educate others</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-foreground mb-2">📋 Requirements:</h4>
                                <ul className="space-y-1">
                                    <li>• Public GitHub repository</li>
                                    <li>• Clear README with setup instructions</li>
                                    <li>• Working code (no broken projects)</li>
                                    <li>• Appropriate license for open source</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}