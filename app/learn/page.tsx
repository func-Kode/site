import Link from "next/link";
import Image from "next/image";

export default function LearnPage() {
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
              Learn & Grow
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Master GitHub, open source contribution, and become a func(Kode) expert with our comprehensive learning resources
          </p>
        </div>

        {/* Learning Paths */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            🎯 Learning Paths
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl shadow-lg p-8 border border-border/50 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center text-brand-blue">Beginner</h3>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-brand-green">✓</span>
                  Git & GitHub Basics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-green">✓</span>
                  Open Source Introduction
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-green">✓</span>
                  func(Kode) Onboarding
                </li>
              </ul>
              <div className="text-center">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  2-3 hours
                </span>
              </div>
            </div>
            
            <div className="bg-card rounded-2xl shadow-lg p-8 border border-border/50 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-green to-brand-green/80 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center text-brand-blue">Intermediate</h3>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-brand-green">✓</span>
                  Advanced Git Workflows
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-green">✓</span>
                  Contributing Best Practices
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-green">✓</span>
                  func(Kode) Dashboard Mastery
                </li>
              </ul>
              <div className="text-center">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  4-5 hours
                </span>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-lg p-8 border border-border/50 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center text-brand-blue">Advanced</h3>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-brand-green">✓</span>
                  Maintainer Responsibilities
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-green">✓</span>
                  Community Leadership
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-green">✓</span>
                  Leaderboard Strategies
                </li>
              </ul>
              <div className="text-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  6+ hours
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* GitHub Fundamentals */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            🐙 GitHub Fundamentals
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-md border border-border/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-black rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-semibold">Git Basics</h3>
                </div>
                <p className="text-muted-foreground mb-4">Master version control fundamentals</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Repository initialization</li>
                  <li>• Commits and commit messages</li>
                  <li>• Branching and merging</li>
                  <li>• Remote repositories</li>
                </ul>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-md border border-border/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-black rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-semibold">GitHub Features</h3>
                </div>
                <p className="text-muted-foreground mb-4">Navigate GitHub like a pro</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Issues and bug tracking</li>
                  <li>• Pull requests workflow</li>
                  <li>• Code reviews</li>
                  <li>• GitHub Actions basics</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-md border border-border/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-black rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <h3 className="text-lg font-semibold">Collaboration</h3>
                </div>
                <p className="text-muted-foreground mb-4">Work effectively with teams</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Forking repositories</li>
                  <li>• Creating meaningful PRs</li>
                  <li>• Handling merge conflicts</li>
                  <li>• Code review etiquette</li>
                </ul>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-md border border-border/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-black rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <h3 className="text-lg font-semibold">Best Practices</h3>
                </div>
                <p className="text-muted-foreground mb-4">Professional development workflow</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Writing good documentation</li>
                  <li>• Issue templates</li>
                  <li>• Semantic versioning</li>
                  <li>• License considerations</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Open Source Contribution */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            🌟 Open Source Contribution
          </h2>
          <div className="bg-gradient-to-r from-brand-green/10 to-brand-blue/10 rounded-2xl p-8 border border-border/50">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-brand-blue">Getting Started</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-green rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Find Good First Issues</h4>
                      <p className="text-sm text-muted-foreground">Look for repositories with &quot;good first issue&quot; labels</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-green rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Read Contributing Guidelines</h4>
                      <p className="text-sm text-muted-foreground">Every project has its own contribution standards</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-green rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Start Small</h4>
                      <p className="text-sm text-muted-foreground">Begin with documentation or small bug fixes</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-brand-blue">Making Impact</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Build Relationships</h4>
                      <p className="text-sm text-muted-foreground">Engage with maintainers and community members</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs">5</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Consistent Contributions</h4>
                      <p className="text-sm text-muted-foreground">Regular small contributions beat sporadic large ones</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs">6</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Become a Maintainer</h4>
                      <p className="text-sm text-muted-foreground">Take ownership and help guide project direction</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* func(Kode) Mastery */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            🏆 func(Kode) Mastery
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-2xl shadow-lg p-8 border border-border/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-primary rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-brand-blue">Dashboard Deep Dive</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Master your func(Kode) dashboard to track progress and optimize your contributions.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-brand-green mt-1">✓</span>
                  <div>
                    <span className="font-medium">Activity Tracking</span>
                    <p className="text-sm text-muted-foreground">Monitor your GitHub activity across func(Kode) repos</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-green mt-1">✓</span>
                  <div>
                    <span className="font-medium">Contribution Analytics</span>
                    <p className="text-sm text-muted-foreground">Visualize your coding patterns and streaks</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-green mt-1">✓</span>
                  <div>
                    <span className="font-medium">Project Management</span>
                    <p className="text-sm text-muted-foreground">View and manage your open issues and PRs</p>
                  </div>
                </li>
              </ul>
              <Link 
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-blue to-primary text-white rounded-full font-semibold hover:shadow-lg transition-all duration-200"
              >
                Explore Dashboard
              </Link>
            </div>

            <div className="bg-card rounded-2xl shadow-lg p-8 border border-border/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-green to-brand-green/80 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏅</span>
                </div>
                <h3 className="text-xl font-semibold text-brand-blue">Leaderboard Strategy</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Climb the func(Kode) leaderboard and showcase your open source expertise.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-brand-green mt-1">✓</span>
                  <div>
                    <span className="font-medium">Ranking System</span>
                    <p className="text-sm text-muted-foreground">Understand how contributions are scored</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-green mt-1">✓</span>
                  <div>
                    <span className="font-medium">Activity Streaks</span>
                    <p className="text-sm text-muted-foreground">Maintain consistent daily contributions</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-green mt-1">✓</span>
                  <div>
                    <span className="font-medium">Community Recognition</span>
                    <p className="text-sm text-muted-foreground">Earn badges and achievements</p>
                  </div>
                </li>
              </ul>
              <Link 
                href="/leaderboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-green to-brand-green/80 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-200"
              >
                View Leaderboard
              </Link>
            </div>
          </div>
        </section>

        {/* Interactive Tutorials */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            🎮 Interactive Tutorials
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card rounded-xl p-6 shadow-md border border-border/50 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4 text-center">🔧</div>
              <h3 className="font-semibold mb-3 text-center">Setup Your Environment</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Step-by-step guide to set up your development environment
              </p>
              <div className="text-center">
                <Link 
                  href="/docs/DEVELOPMENT_SETUP.md"
                  className="text-brand-blue hover:underline text-sm font-medium"
                >
                  Start Tutorial →
                </Link>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-md border border-border/50 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4 text-center">🚀</div>
              <h3 className="font-semibold mb-3 text-center">Your First Contribution</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Make your first pull request to a func(Kode) repository
              </p>
              <div className="text-center">
                <Link 
                  href="/projects"
                  className="text-brand-blue hover:underline text-sm font-medium"
                >
                  Start Contributing →
                </Link>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-md border border-border/50 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4 text-center">🎯</div>
              <h3 className="font-semibold mb-3 text-center">Advanced Git Workflows</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Master complex Git operations and collaborative workflows
              </p>
              <div className="text-center">
                <span className="text-muted-foreground text-sm">Coming Soon</span>
              </div>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            📚 Additional Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-6 shadow-md border border-border/50">
              <h3 className="text-lg font-semibold mb-4">📖 Recommended Reading</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <a href="https://docs.github.com" className="text-brand-blue hover:underline">GitHub Documentation</a></li>
                <li>• <a href="https://git-scm.com/doc" className="text-brand-blue hover:underline">Official Git Documentation</a></li>
                <li>• <a href="https://opensource.guide" className="text-brand-blue hover:underline">Open Source Guides</a></li>
                <li>• <a href="https://github.com/firstcontributions/first-contributions" className="text-brand-blue hover:underline">First Contributions</a></li>
              </ul>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-md border border-border/50">
              <h3 className="text-lg font-semibold mb-4">🛠️ Tools & Extensions</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <a href="https://desktop.github.com" className="text-brand-blue hover:underline">GitHub Desktop</a></li>
                <li>• <a href="https://code.visualstudio.com" className="text-brand-blue hover:underline">VS Code with Git extensions</a></li>
                <li>• <a href="https://cli.github.com" className="text-brand-blue hover:underline">GitHub CLI</a></li>
                <li>• <a href="https://www.gitkraken.com" className="text-brand-blue hover:underline">GitKraken (Visual Git tool)</a></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-brand-green via-brand-blue to-primary rounded-2xl shadow-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Choose your learning path and begin your journey to becoming an open source contributor!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/docs/DEVELOPMENT_SETUP.md"
                className="px-8 py-4 bg-white text-brand-blue font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start with Setup
              </Link>
              <Link 
                href="/projects"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-brand-blue transition-all duration-200"
              >
                Browse Projects
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
