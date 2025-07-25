import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface ContributorBadge {
    type: string;
    awardedAt: string;
    evidence?: {
        pr_number?: string;
        issue_number?: string;
        event_name?: string;
        project_url?: string;
    };
}

interface ContributorData {
    username: string;
    badges: ContributorBadge[];
    totalContributions: number;
    joinDate: string;
    xp?: number;
    level?: number;
    streak?: number;
    lastContribution?: string;
    specialties?: string[];
}

const LEVEL_SYSTEM = {
    1: { title: "Explorer", minXP: 0, color: "gray", icon: "🌱" },
    2: { title: "Contributor", minXP: 10, color: "blue", icon: "👨‍💻" },
    3: { title: "Collaborator", minXP: 25, color: "green", icon: "🤝" },
    4: { title: "Maintainer", minXP: 50, color: "purple", icon: "🔧" },
    5: { title: "Architect", minXP: 100, color: "yellow", icon: "🏗️" },
    6: { title: "Legend", minXP: 200, color: "red", icon: "⚡" }
};

function calculateLevel(xp: number): number {
    const levels = Object.entries(LEVEL_SYSTEM).reverse();
    for (const [level, config] of levels) {
        if (xp >= config.minXP) {
            return parseInt(level);
        }
    }
    return 1;
}

export async function GET() {
    try {
        const badgesDir = path.join(process.cwd(), 'community', 'badges');

        // Check if badges directory exists
        if (!fs.existsSync(badgesDir)) {
            return NextResponse.json({
                contributors: [],
                stats: {
                    totalBadges: 0,
                    totalContributors: 0,
                    totalXP: 0,
                    averageLevel: 0,
                    levelDistribution: {}
                }
            });
        }

        const files = fs.readdirSync(badgesDir).filter(file => file.endsWith('.json'));
        const contributors: ContributorData[] = [];

        for (const file of files) {
            try {
                const filePath = path.join(badgesDir, file);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                // Ensure all gamification fields exist
                const enhancedData = {
                    ...data,
                    xp: data.xp || 0,
                    level: data.level || 1,
                    streak: data.streak || 1,
                    lastContribution: data.lastContribution || new Date().toISOString().split('T')[0],
                    specialties: data.specialties || []
                };

                // Recalculate level if needed
                if (enhancedData.xp > 0) {
                    enhancedData.level = calculateLevel(enhancedData.xp);
                }

                contributors.push(enhancedData);
            } catch (error) {
                console.error(`Error reading badge file ${file}:`, error);
            }
        }

        // Sort contributors by XP (descending)
        contributors.sort((a, b) => (b.xp || 0) - (a.xp || 0));

        // Calculate enhanced stats
        const totalBadges = contributors.reduce((sum, c) => sum + c.badges.length, 0);
        const totalContributors = contributors.length;
        const totalXP = contributors.reduce((sum, c) => sum + (c.xp || 0), 0);
        const averageLevel = totalContributors > 0 ? totalXP / totalContributors : 0;
        const badgeTypes = new Set(contributors.flatMap(c => c.badges.map((b: ContributorBadge) => b.type)));

        // Calculate level distribution
        const levelDistribution: Record<string, number> = {};
        contributors.forEach(contributor => {
            const level = contributor.level || 1;
            levelDistribution[level] = (levelDistribution[level] || 0) + 1;
        });

        // Calculate badge type distribution
        const badgeTypeCount: Record<string, number> = {};
        contributors.forEach(contributor => {
            contributor.badges.forEach((badge: ContributorBadge) => {
                badgeTypeCount[badge.type] = (badgeTypeCount[badge.type] || 0) + 1;
            });
        });

        // Get recent activity (last 10 badge awards)
        const recentBadges = contributors
            .flatMap(c => c.badges.map((b: ContributorBadge) => ({ ...b, username: c.username })))
            .sort((a, b) => new Date(b.awardedAt).getTime() - new Date(a.awardedAt).getTime())
            .slice(0, 10);

        const stats = {
            totalBadges,
            totalContributors,
            totalXP,
            averageLevel: Math.round(averageLevel * 10) / 10,
            uniqueBadgeTypes: badgeTypes.size,
            levelDistribution,
            badgeTypeDistribution: badgeTypeCount,
            topStreak: Math.max(...contributors.map(c => c.streak || 1)),
            recentBadges
        };

        return NextResponse.json({
            contributors,
            stats,
            levelSystem: LEVEL_SYSTEM
        });

    } catch (error) {
        console.error('Error fetching badge data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch badge data' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { username, badgeType } = await request.json();

        if (!username || !badgeType) {
            return NextResponse.json(
                { error: 'Username and badgeType are required' },
                { status: 400 }
            );
        }

        // This would typically require authentication/authorization
        // For now, we'll return a success response
        return NextResponse.json({
            success: true,
            message: `Badge ${badgeType} would be awarded to ${username}`,
            note: 'This endpoint requires proper authentication in production'
        });

    } catch (error) {
        console.error('Error awarding badge:', error);
        return NextResponse.json(
            { error: 'Failed to award badge' },
            { status: 500 }
        );
    }
}