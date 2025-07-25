import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface BadgeData {
  badgeType: string;
  evidence?: Record<string, unknown>;
  xpGained: number;
}

interface LevelUpData {
  newLevel: number;
  newTitle: string;
  totalXP: number;
}

interface StreakData {
  streakDays: number;
  milestone: string;
}

interface ActivityItem {
  id: string;
  type: 'badge_awarded' | 'level_up' | 'streak_milestone' | 'project_submitted';
  username: string;
  timestamp: string;
  data: BadgeData | LevelUpData | StreakData | Record<string, unknown>;
  avatar?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type'); // Filter by activity type

    const badgesDir = path.join(process.cwd(), 'community', 'badges');
    
    if (!fs.existsSync(badgesDir)) {
      return NextResponse.json({ activities: [], hasMore: false });
    }

    const activities: ActivityItem[] = [];
    const files = fs.readdirSync(badgesDir).filter(file => file.endsWith('.json'));

    // Collect all activities from badge files
    for (const file of files) {
      try {
        const filePath = path.join(badgesDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Add badge awards as activities
        data.badges.forEach((badge: { type: string; awardedAt: string; evidence?: Record<string, unknown> }, index: number) => {
          activities.push({
            id: `${data.username}-badge-${index}-${badge.awardedAt}`,
            type: 'badge_awarded',
            username: data.username,
            timestamp: badge.awardedAt,
            data: {
              badgeType: badge.type,
              evidence: badge.evidence,
              xpGained: getBadgeXP(badge.type)
            },
            avatar: `https://github.com/${data.username}.png`
          });
        });

        // Add level up activities (simulated based on XP milestones)
        if (data.level && data.level > 1) {
          const levelUpTime = new Date(data.joinDate);
          levelUpTime.setDate(levelUpTime.getDate() + (data.level - 1) * 7); // Simulate level ups every week
          
          activities.push({
            id: `${data.username}-levelup-${data.level}`,
            type: 'level_up',
            username: data.username,
            timestamp: levelUpTime.toISOString(),
            data: {
              newLevel: data.level,
              newTitle: getLevelTitle(data.level),
              totalXP: data.xp || 0
            },
            avatar: `https://github.com/${data.username}.png`
          });
        }

        // Add streak milestones
        if (data.streak && data.streak >= 7 && data.streak % 7 === 0) {
          const streakTime = new Date(data.lastContribution || data.joinDate);
          
          activities.push({
            id: `${data.username}-streak-${data.streak}`,
            type: 'streak_milestone',
            username: data.username,
            timestamp: streakTime.toISOString(),
            data: {
              streakDays: data.streak,
              milestone: data.streak >= 30 ? 'month' : 'week'
            },
            avatar: `https://github.com/${data.username}.png`
          });
        }

      } catch (error) {
        console.error(`Error processing ${file}:`, error);
      }
    }

    // Sort activities by timestamp (newest first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Filter by type if specified
    let filteredActivities = activities;
    if (type) {
      filteredActivities = activities.filter(activity => activity.type === type);
    }

    // Apply pagination
    const paginatedActivities = filteredActivities.slice(offset, offset + limit);
    const hasMore = offset + limit < filteredActivities.length;

    // Enhance activities with additional context
    const enhancedActivities = paginatedActivities.map(activity => ({
      ...activity,
      timeAgo: getTimeAgo(activity.timestamp),
      formattedMessage: formatActivityMessage(activity)
    }));

    return NextResponse.json({
      activities: enhancedActivities,
      hasMore,
      total: filteredActivities.length,
      stats: {
        totalActivities: activities.length,
        recentBadges: activities.filter(a => a.type === 'badge_awarded' && isRecent(a.timestamp)).length,
        recentLevelUps: activities.filter(a => a.type === 'level_up' && isRecent(a.timestamp)).length
      }
    });

  } catch (error) {
    console.error('Error fetching activity feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity feed' },
      { status: 500 }
    );
  }
}

function getBadgeXP(badgeType: string): number {
  const xpValues: Record<string, number> = {
    first_pr: 5,
    issue_resolver: 2,
    code_reviewer: 3,
    event_participation: 8,
    project_submission: 10,
    top_contributor: 15,
    pr_master: 20,
    issue_hunter: 25,
    community_champion: 30,
    streak_warrior: 25
  };
  return xpValues[badgeType] || 1;
}

function getLevelTitle(level: number): string {
  const titles: Record<number, string> = {
    1: "Explorer",
    2: "Contributor", 
    3: "Collaborator",
    4: "Maintainer",
    5: "Architect",
    6: "Legend"
  };
  return titles[level] || "Explorer";
}

function getTimeAgo(timestamp: string | Date): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return time.toLocaleDateString();
}

function isRecent(timestamp: string | Date): boolean {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInHours = (now.getTime() - time.getTime()) / (1000 * 60 * 60);
  return diffInHours <= 24; // Last 24 hours
}

function formatActivityMessage(activity: ActivityItem): string {
  switch (activity.type) {
    case 'badge_awarded':
      const badgeData = activity.data as BadgeData;
      const badgeName = badgeData.badgeType.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      return `earned the ${badgeName} badge (+${badgeData.xpGained} XP)`;
    
    case 'level_up':
      const levelData = activity.data as LevelUpData;
      return `leveled up to ${levelData.newTitle} (Level ${levelData.newLevel})`;
    
    case 'streak_milestone':
      const streakData = activity.data as StreakData;
      return `reached a ${streakData.streakDays}-day contribution streak!`;
    
    case 'project_submitted':
      return `submitted a new project`;
    
    default:
      return 'had some activity';
  }
}