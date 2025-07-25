import { NextResponse } from 'next/server';

export type Project = {
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');
  const featured = searchParams.get('featured');
  const search = searchParams.get('search');

  let filteredProjects = [...projects];

  // Apply filters
  if (category && category !== 'All') {
    filteredProjects = filteredProjects.filter(project => project.category === category);
  }

  if (difficulty && difficulty !== 'All') {
    filteredProjects = filteredProjects.filter(project => project.difficulty === difficulty);
  }

  if (featured === 'true') {
    filteredProjects = filteredProjects.filter(project => project.featured);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredProjects = filteredProjects.filter(project =>
      project.title.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  // Sort by stars (popularity)
  filteredProjects.sort((a, b) => b.stars - a.stars);

  return NextResponse.json({
    projects: filteredProjects,
    total: projects.length,
    filtered: filteredProjects.length
  });
}

export async function POST(request: Request) {
  // This would handle project submissions in a real app
  const body = await request.json();
  
  // In a real app, you'd validate the data and save to database
  // For now, just return a success response
  return NextResponse.json({
    success: true,
    message: "Project submitted successfully! It will be reviewed by our team.",
    projectId: `temp-${Date.now()}`
  }, { status: 201 });
}