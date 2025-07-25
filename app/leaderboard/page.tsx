'use client';

export default function Leaderboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Community Leaderboard</h1>
          <p className="text-lg text-muted-foreground">
            Top contributors in the func(Kode) community
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
          <p className="text-gray-600">
            The community leaderboard is currently under development. 
            Check back soon to see top contributors and their achievements!
          </p>
          <div className="mt-6">
            <a 
              href="/contributor-dashboard" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Your Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
