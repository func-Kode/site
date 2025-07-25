import { NextResponse } from 'next/server';

// Import the projects data (in a real app, this would come from a database)
const projects = [
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
  }
  // ... other projects would be here in a real app
];

export async function GET(
  request: Request,
  context
) {
  const { params } = context;
  const project = projects.find(p => p.id === params.id);

  if (!project) {
    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(project);
}

export async function PUT(
  request: Request,
  context
) {
  const { params } = context;
  // This would handle project updates in a real app
  await request.json();
  
  // In a real app, you'd validate the data and update in database
  return NextResponse.json({
    success: true,
    message: "Project updated successfully!",
    projectId: params.id
  });
}

export async function DELETE(
  request: Request,
  context
) {
  const { params } = context;
  // This would handle project deletion in a real app
  return NextResponse.json({
    success: true,
    message: "Project deleted successfully!",
    projectId: params.id
  });
}