import Link from "next/link";
import Image from "next/image";

export default function DocsPage() {
  return (
    <main className="bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="inline-block animate-bounce">
              <Image 
                src="/raccoon.png" 
                alt="Raccoon Mascot" 
                width={56} 
                height={56}
              />
            </span>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-blue via-primary to-brand-green bg-clip-text text-transparent">
              Developer Documentation
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to contribute to func(Kode) and build together with our community
          </p>
        </div>

        {/* Quick Start Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            🚀 Quick Start
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-2xl shadow-lg p-8 border border-border/50">
              <h3 className="text-xl font-semibold mb-4 text-brand-blue">For New Contributors</h3>
              <p className="text-muted-foreground mb-6">
                Get started with your own development environment in minutes.
              </p>
              <Link 
                href="/docs/DEVELOPMENT_SETUP.md"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-green to-brand-green/80 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-200"
              >
                📖 Setup Guide
              </Link>
            </div>
            <div className="bg-card rounded-2xl shadow-lg p-8 border border-border/50">
              <h3 className="text-xl font-semibold mb-4 text-brand-blue">OAuth Architecture</h3>
              <p className="text-muted-foreground mb-6">
                Understand our secure dual OAuth setup for production and development.
              </p>
              <Link 
                href="/docs/OAUTH_ARCHITECTURE.md"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-blue to-primary text-white rounded-full font-semibold hover:shadow-lg transition-all duration-200"
              >
                🔒 Security Docs
              </Link>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            🛠️ Tech Stack
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">⚛️</div>
              <h3 className="font-semibold mb-2">Next.js 15</h3>
              <p className="text-sm text-muted-foreground">App Router, Server Components, TypeScript</p>
            </div>
            <div className="bg-card rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="font-semibold mb-2">Tailwind CSS</h3>
              <p className="text-sm text-muted-foreground">Utility-first CSS framework</p>
            </div>
            <div className="bg-card rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🗄️</div>
              <h3 className="font-semibold mb-2">Supabase</h3>
              <p className="text-sm text-muted-foreground">Auth, Database, Real-time</p>
            </div>
            <div className="bg-card rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🐙</div>
              <h3 className="font-semibold mb-2">GitHub</h3>
              <p className="text-sm text-muted-foreground">OAuth, Webhooks, API</p>
            </div>
          </div>
        </section>

        {/* Project Structure */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            📁 Project Structure
          </h2>
          <div className="bg-card rounded-2xl shadow-lg p-8 border border-border/50">
            <pre className="text-sm text-muted-foreground overflow-x-auto">
{`funcKode/site/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # User dashboard
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components
│   └── tutorial/        # Tutorial components
├── lib/                 # Utility libraries
│   └── supabase/       # Supabase client & utilities
├── docs/               # Documentation files
├── database/           # Database schema
└── public/            # Static assets`}
            </pre>
          </div>
        </section>

        {/* Development Workflow */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            🔄 Development Workflow
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-brand-green">1. Fork & Clone</h3>
                <code className="block bg-muted p-3 rounded text-sm">
                  git clone https://github.com/YOUR_USERNAME/site.git
                </code>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-brand-green">2. Set Up Environment</h3>
                <p className="text-sm text-muted-foreground mb-2">Create your own:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• GitHub OAuth App</li>
                  <li>• Supabase Project</li>
                  <li>• Environment Variables</li>
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-brand-green">3. Develop & Test</h3>
                <code className="block bg-muted p-3 rounded text-sm mb-2">
                  npm install && npm run dev
                </code>
                <p className="text-xs text-muted-foreground">Test locally on localhost:3000</p>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-brand-green">4. Submit PR</h3>
                <p className="text-sm text-muted-foreground">Create pull request to dev branch</p>
              </div>
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            📡 API Reference
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">GitHub Webhooks</h3>
              <code className="text-xs bg-muted p-2 rounded block mb-2">/api/github/webhook</code>
              <p className="text-sm text-muted-foreground">Handles GitHub events for activity tracking</p>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Activity Feed</h3>
              <code className="text-xs bg-muted p-2 rounded block mb-2">/api/activity-feed</code>
              <p className="text-sm text-muted-foreground">Real-time organization activity data</p>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Projects API</h3>
              <code className="text-xs bg-muted p-2 rounded block mb-2">/api/projects</code>
              <p className="text-sm text-muted-foreground">CRUD operations for projects</p>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Auth Callback</h3>
              <code className="text-xs bg-muted p-2 rounded block mb-2">/auth/callback</code>
              <p className="text-sm text-muted-foreground">OAuth callback handler</p>
            </div>
          </div>
        </section>

        {/* Contributing Guidelines */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            🤝 Contributing Guidelines
          </h2>
          <div className="bg-card rounded-2xl shadow-lg p-8 border border-border/50">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-brand-blue">Code Standards</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-brand-green">✓</span>
                    TypeScript for type safety
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-green">✓</span>
                    ESLint for code quality
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-green">✓</span>
                    Prettier for formatting
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-green">✓</span>
                    Meaningful commit messages
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-brand-blue">PR Guidelines</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-brand-green">✓</span>
                    Create feature branch from dev
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-green">✓</span>
                    Test your changes locally
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-green">✓</span>
                    Update documentation if needed
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-green">✓</span>
                    Link related issues
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Resources & Links */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            🔗 Resources & Links
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              href="https://github.com/func-Kode/site"
              className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow block"
            >
              <div className="text-2xl mb-3">🐙</div>
              <h3 className="font-semibold mb-2">GitHub Repository</h3>
              <p className="text-sm text-muted-foreground">Main codebase and issues</p>
            </Link>
            <Link 
              href="https://func-kode.netlify.app"
              className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow block"
            >
              <div className="text-2xl mb-3">🌐</div>
              <h3 className="font-semibold mb-2">Live Site</h3>
              <p className="text-sm text-muted-foreground">Production deployment</p>
            </Link>
            <Link 
              href="/about"
              className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow block"
            >
              <div className="text-2xl mb-3">ℹ️</div>
              <h3 className="font-semibold mb-2">About func(Kode)</h3>
              <p className="text-sm text-muted-foreground">Learn about our mission</p>
            </Link>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-brand-blue via-primary to-brand-green rounded-2xl shadow-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Build Together?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join our community of developers and start contributing to open-source projects today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/docs/DEVELOPMENT_SETUP.md"
                className="px-8 py-4 bg-white text-brand-blue font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Contributing
              </Link>
              <Link 
                href="/projects"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-brand-blue transition-all duration-200"
              >
                View Projects
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
