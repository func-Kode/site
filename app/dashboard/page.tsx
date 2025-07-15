"use client";
import { useEffect, useState, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import { getActivityLogs } from "@/lib/supabase/getActivityLogs";

interface Activity {
	id: string;
	repo: string;
	event_type: string;
	username: string;
	action: string;
	created_at: string;
}

interface Repo {
	id: string;
	name: string;
	full_name: string;
	html_url: string;
	private: boolean;
	stargazers_count: number;
	forks_count: number;
	open_issues_count: number;
	owner?: {
		login?: string;
	};
}

interface Issue {
	id: string;
	title: string;
	html_url: string;
	state: string;
	assignee?: {
		login?: string;
	};
	repository_url?: string;
}

interface Discussion {
	id: string;
	title: string;
	html_url: string;
	repository_url?: string;
}

export default function DashboardPage() {
	const [user, setUser] = useState<User | null>(null);
	const [repos, setRepos] = useState<Repo[]>([]);
	const [issues, setIssues] = useState<Issue[]>([]);
	const [discussions, setDiscussions] = useState<Discussion[]>([]);
	const [contribData, setContribData] = useState<{ date: string; count: number }[]>([]);
	const [starredRepos, setStarredRepos] = useState<Repo[]>([]);
	const [activities, setActivities] = useState<Activity[]>([]);
	const [loadingRepos, setLoadingRepos] = useState(false);
	const [loadingIssues, setLoadingIssues] = useState(false);
	const [loadingDiscussions, setLoadingDiscussions] = useState(false);
	const [loadingContrib, setLoadingContrib] = useState(false);
	const [loadingStarred, setLoadingStarred] = useState(false);
	const [loadingActivities, setLoadingActivities] = useState(true);
	const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");

	useEffect(() => {
		const supabase = createClientComponentClient();
		supabase.auth.getUser().then(async ({ data }) => {
			setUser(data.user);
			if (data.user) {
				// Get the access token and github username from your users table
				const { data: userRow } = await supabase
					.from("users")
					.select("github_access_token, github_username")
					.eq("id", data.user.id)
					.single();
				const token = userRow?.github_access_token;
				const ghUsername = userRow?.github_username;
				if (token && ghUsername) {
					// 1. Contributions to func(Kode) repos (PRs/commits)
					setLoadingRepos(true);
					// Only fetch repos from funcKode org
					const orgReposRes = await fetch(
						"https://api.github.com/orgs/funcKode/repos",
						{
							headers: { Authorization: `token ${token}` },
						}
					);
					const orgRepos = orgReposRes.ok ? await orgReposRes.json() : [];
					setRepos(orgRepos);
					setLoadingRepos(false);

					// 2. Active issues assigned (in funcKode org only)
					setLoadingIssues(true);
					const assignedIssues: Issue[] = [];
					for (const repo of orgRepos) {
						// Fetch all open issues for the repo
						const issuesRes = await fetch(
							`https://api.github.com/repos/funcKode/${repo.name}/issues?state=open`,
							{
								headers: { Authorization: `token ${token}` },
							}
						);
						if (issuesRes.ok) {
							const issuesData = await issuesRes.json();
							// Log all issues for debugging
							console.log(`Issues for repo ${repo.name}:`, issuesData);
							// Show issues assigned to or created by the user
							assignedIssues.push(
								...issuesData.filter(
									(issue: Issue & { user?: { login?: string } }) =>
										issue.assignee?.login === ghUsername ||
										issue.user?.login === ghUsername
								)
							);
						}
					}
					setIssues(assignedIssues);
					setLoadingIssues(false);

					// 3. Discussions participated (in funcKode org only)
					setLoadingDiscussions(true);
					let allDiscussions: Discussion[] = [];
					for (const repo of orgRepos) {
						const discRes = await fetch(
							`https://api.github.com/repos/funcKode/${repo.name}/discussions`,
							{
								headers: { Authorization: `token ${token}` },
							}
						);
						if (discRes.ok) {
							const discData = await discRes.json();
							allDiscussions = allDiscussions.concat(
								discData.filter(
									(d: Discussion & { user?: { login?: string }; comments?: { user?: { login?: string } }[] }) =>
										d.user?.login === ghUsername ||
										d.comments?.some(
											(c: { user?: { login?: string } }) => c.user?.login === ghUsername
										)
								)
							);
						}
					}
					setDiscussions(allDiscussions);
					setLoadingDiscussions(false);

					// 4. Fun graph of contributions over time (in funcKode org only)
					setLoadingContrib(true);
					let allEvents: { actor?: { login?: string }; created_at: string }[] = [];
					for (const repo of orgRepos) {
						const eventsRes = await fetch(
							`https://api.github.com/repos/funcKode/${repo.name}/events`,
							{
								headers: { Authorization: `token ${token}` },
							}
						);
						if (eventsRes.ok) {
							allEvents = allEvents.concat(await eventsRes.json());
						}
					}
					// Aggregate by day
					const byDay: Record<string, number> = {};
					allEvents.forEach((e: { actor?: { login?: string }; created_at: string }) => {
						if (e.actor?.login === ghUsername) {
							const day = e.created_at.slice(0, 10);
							byDay[day] = (byDay[day] || 0) + 1;
						}
					});
					setContribData(
						Object.entries(byDay).map(([date, count]) => ({ date, count }))
					);
					setLoadingContrib(false);

					// Starred funcKode repos (already filtered)
					setLoadingStarred(true);
					const starredRes = await fetch("https://api.github.com/user/starred", {
						headers: { Authorization: `token ${token}` },
					});
					if (starredRes.ok) {
						const allStarred = await starredRes.json();
						setStarredRepos(
							allStarred.filter(
								(repo: Repo & { owner?: { login?: string } }) => repo.owner?.login?.toLowerCase() === "funckode"
							)
						);
					}
					setLoadingStarred(false);
				}
			}
		});
		// Store GitHub access token in users table after login
		(async () => {
			const { data: sessionData } = await supabase.auth.getSession();
			const accessToken = sessionData.session?.provider_token;
			if (accessToken && user?.id) {
				await supabase
					.from("users")
					.update({ github_access_token: accessToken })
					.eq("id", user.id);
			}
		})();

		// Fetch activity logs from Supabase
		(async () => {
			setLoadingActivities(true);
			const { data } = await getActivityLogs({ limit: 30 });
			setActivities(data || []);
			setLoadingActivities(false);
		})();
	}, [user?.id]);

	// Filtered and grouped activities
	const filteredActivities = useMemo(() => {
		if (eventTypeFilter === "all") return activities;
		return activities.filter((a: Activity) => a.event_type === eventTypeFilter);
	}, [activities, eventTypeFilter]);

	const groupedByRepo = useMemo(() => {
		const groups: Record<string, Activity[]> = {};
		filteredActivities.forEach((a: Activity) => {
			if (!groups[a.repo]) groups[a.repo] = [];
			groups[a.repo].push(a);
		});
		return groups;
	}, [filteredActivities]);

	// Contribution graph data (by day)
	const contribGraphData = useMemo(() => {
		const byDay: Record<string, number> = {};
		activities.forEach((a: Activity) => {
			const day = a.created_at.slice(0, 10);
			byDay[day] = (byDay[day] || 0) + 1;
		});
		return Object.entries(byDay).map(([date, count]) => ({ date, count }));
	}, [activities]);

	// Activity streak calculation
	const streak = useMemo(() => {
		const days = new Set(activities.map((a: Activity) => a.created_at.slice(0, 10)));
		const today = new Date();
		let currentStreak = 0;
		for (let i = 0; i < 365; i++) {
			const d = new Date(today);
			d.setDate(today.getDate() - i);
			const key = d.toISOString().slice(0, 10);
			if (days.has(key)) {
				currentStreak++;
			} else {
				break;
			}
		}
		return currentStreak;
	}, [activities]);

	return (
		<main className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center gap-8">
			<div className="flex flex-col items-center gap-3">
				<span className="inline-block animate-bounce">
					<Image src="/raccoon.png" alt="Raccoon Mascot" width={56} height={56} />
				</span>
				<h1 className="text-3xl font-bold text-brand-blue dark:text-brand-blue text-center">
					funcKode Organization Dashboard
				</h1>
				{user && (
					<p className="text-brand-green text-center">
						Signed in as <span className="font-semibold">{user.email}</span>
					</p>
				)}
				<p className="text-gray-500 text-center max-w-xl mt-2">
					All activity, issues, discussions, and contributions below are scoped to the{" "}
					<span className="font-semibold">funcKode</span> GitHub organization.
				</p>
			</div>

			{/* Organization-wide Issue Tracker */}
			<section className="w-full mt-8">
				<h2 className="text-2xl font-bold text-brand-blue dark:text-brand-blue mb-4">
					Open Issues Across funcKode Organization
				</h2>
				<div className="bg-white dark:bg-card rounded-lg shadow p-4 flex flex-col gap-3">
					{loadingIssues ? (
						<div className="text-gray-500">Loading issues...</div>
					) : issues.length === 0 ? (
						<div className="text-gray-500">No open issues found in funcKode repos.</div>
					) : (
						issues.map((issue: Issue) => (
							<div key={issue.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b last:border-b-0 border-gray-200 dark:border-gray-700 py-2">
								<div>
									<a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-blue hover:underline">
										{issue.title}
									</a>
									<span className="ml-2 text-xs text-gray-500">[{issue.repository_url?.split("repos/")[1]}]</span>
								</div>
								<div className="flex items-center gap-2 mt-2 sm:mt-0">
									<span className="text-xs text-gray-400">State: {issue.state}</span>
									{issue.assignee && <span className="text-xs text-gray-400">Assignee: {issue.assignee.login}</span>}
								</div>
							</div>
						))
					)}
				</div>
			</section>

			{/* Discussions Section */}
			<section className="w-full mt-8">
				<h2 className="text-2xl font-bold mb-4">Discussions in funcKode Organization</h2>
				<div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
					{loadingDiscussions ? <div>Loading...</div> : discussions.length === 0 ? <div>No discussions found.</div> : (
						discussions.map((disc: Discussion) => (
							<div key={disc.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b last:border-b-0 border-gray-200 py-2">
								<div>
									<a href={disc.html_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-blue hover:underline">
										{disc.title}
									</a>
									<span className="ml-2 text-xs text-gray-500">[{disc.repository_url?.split("repos/")[1]}]</span>
								</div>
							</div>
						))
					)}
				</div>
			</section>

			{/* funcKode Repositories Section */}
			<section className="w-full mt-8">
				<h2 className="text-2xl font-bold text-brand-blue dark:text-brand-blue mb-4">funcKode Organization Repositories</h2>
				<div className="bg-white dark:bg-card rounded-lg shadow p-4 flex flex-col gap-3">
					{loadingRepos ? <div className="text-gray-500">Loading repositories...</div> : repos.length === 0 ? <div className="text-gray-500">No repositories found.</div> : (
						repos.map((repo: Repo) => (
							<div key={repo.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b last:border-b-0 border-gray-200 dark:border-gray-700 py-2">
								<div>
									<a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-blue hover:underline">
										{repo.full_name}
									</a>
									<span className="ml-2 text-xs text-gray-500">{repo.private ? "Private" : "Public"}</span>
								</div>
								<div className="flex items-center gap-2 mt-2 sm:mt-0">
									<span className="text-xs text-gray-400">★ {repo.stargazers_count}</span>
									<span className="text-xs text-gray-400">Forks: {repo.forks_count}</span>
									<span className="text-xs text-gray-400">Issues: {repo.open_issues_count}</span>
								</div>
							</div>
						))
					)}
				</div>
			</section>

			{/* Contribution Activity Graph Section */}
			<section className="w-full mt-8">
				<h2 className="text-2xl font-bold mb-4">Your Contribution Activity in funcKode</h2>
				<div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
					{loadingContrib ? <div>Loading...</div> : contribData.length === 0 ? <div>No contribution data found.</div> : <canvas id="contrib-graph" width="600" height="200"></canvas>}
				</div>
			</section>

			{/* Starred funcKode Repositories Section */}
			<section className="w-full mt-8">
				<h2 className="text-2xl font-bold mb-4">Starred funcKode Repositories</h2>
				<div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
					{loadingStarred ? <div>Loading...</div> : starredRepos.length === 0 ? <div>No funcKode repos starred.</div> : (
						starredRepos.map((repo: Repo) => (
							<div key={repo.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b last:border-b-0 border-gray-200 py-2">
								<div>
									<a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-blue hover:underline">
										{repo.full_name}
									</a>
								</div>
								<div className="flex items-center gap-2 mt-2 sm:mt-0">
									<span className="text-xs text-gray-400">★ {repo.stargazers_count}</span>
									<span className="text-xs text-gray-400">Forks: {repo.forks_count}</span>
								</div>
							</div>
						))
					)}
				</div>
			</section>

			{/* Activity Logs Section */}
			<section className="w-full mt-8">
				<div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-2">
					<h2 className="text-2xl font-bold">Recent Organization Activity</h2>
					<div className="flex items-center gap-2">
						<label htmlFor="eventType" className="text-sm font-medium">Filter by event type:</label>
						<select
							id="eventType"
							className="border rounded px-2 py-1 text-sm"
							value={eventTypeFilter}
							onChange={e => setEventTypeFilter(e.target.value)}
						>
							<option value="all">All</option>
							{[...new Set(activities.map((a: Activity) => a.event_type))].map(type => (
								<option key={type} value={type}>{type}</option>
							))}
						</select>
					</div>
				</div>
				<div className="mb-4 flex flex-wrap gap-4">
					<div className="bg-brand-green text-white rounded px-4 py-2 text-center">
						<span className="font-bold text-lg">{streak}</span> day activity streak
					</div>
					<div className="bg-brand-blue text-white rounded px-4 py-2 text-center">
						<span className="font-bold text-lg">{activities.length}</span> total activities
					</div>
				</div>
				<div className="mb-6">
					<h3 className="font-semibold mb-2">Contribution Graph</h3>
					<ContributionGraph data={contribGraphData} />
				</div>
				{loadingActivities ? <div>Loading...</div> : Object.keys(groupedByRepo).length === 0 ? <div>No recent activity found.</div> : (
					Object.entries(groupedByRepo).map(([repo, acts]) => (
						<details key={repo} open className="mb-2">
							<summary className="font-semibold text-brand-blue cursor-pointer select-none bg-gray-100 px-2 py-1 rounded mb-1">{repo} <span className="text-xs text-gray-400">({acts.length})</span></summary>
							<div className="flex flex-col gap-2">
								{acts.map((activity: Activity) => (
									<div key={activity.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b last:border-b-0 border-gray-200 py-2">
										<div>
											<span className="font-semibold text-brand-blue">{activity.event_type}</span>
											<span className="ml-2 text-xs text-gray-400">{activity.username}</span>
											<span className="ml-2 text-xs text-gray-400">{activity.action}</span>
										</div>
										<div className="text-xs text-gray-400 mt-1 sm:mt-0">
											{new Date(activity.created_at).toLocaleString()}
										</div>
									</div>
								))}
							</div>
						</details>
					))
				)}
			</section>
		</main>
	);
}

// ContributionGraph component (add at bottom of file)
function ContributionGraph({ data }: { data: { date: string, count: number }[] }) {
  // ...existing code...
  // Use Chart.js or a simple SVG for a heatmap/line chart
  // For brevity, render a simple bar chart with SVG
  if (!data.length) return <div className="text-gray-400">No data</div>;
  const max = Math.max(...data.map(d => d.count));
  return (
    <svg width={data.length * 8} height={40} className="block">
      {data.map((d, i) => (
        <rect
          key={d.date}
          x={i * 8}
          y={40 - (d.count / max) * 36}
          width={6}
          height={(d.count / max) * 36}
          fill="#2563eb"
        >
          <title>{d.date}: {d.count} activities</title>
        </rect>
      ))}
    </svg>
  );
}

