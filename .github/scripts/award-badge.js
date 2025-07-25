#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Badge configurations with XP values and levels
const BADGE_CONFIGS = {
  first_pr: {
    name: 'First PR',
    emoji: '👍',
    color: 'green',
    description: 'Merged their first pull request',
    xp: 5,
    rarity: 'common'
  },
  issue_resolver: {
    name: 'Issue Resolver',
    emoji: '🔧',
    color: 'blue',
    description: 'Closed an issue',
    xp: 2,
    rarity: 'common'
  },
  code_reviewer: {
    name: 'Code Reviewer',
    emoji: '👀',
    color: 'purple',
    description: 'Reviewed a pull request',
    xp: 3,
    rarity: 'common'
  },
  event_participation: {
    name: 'Event Participant',
    emoji: '🎉',
    color: 'orange',
    description: 'Participated in a community event',
    xp: 8,
    rarity: 'rare'
  },
  project_submission: {
    name: 'Project Submitter',
    emoji: '🚀',
    color: 'red',
    description: 'Submitted a project',
    xp: 10,
    rarity: 'rare'
  },
  top_contributor: {
    name: 'Top Contributor',
    emoji: '⭐',
    color: 'gold',
    description: 'Top contributor of the month',
    xp: 15,
    rarity: 'legendary'
  },
  // New milestone badges
  pr_master: {
    name: 'PR Master',
    emoji: '🏆',
    color: 'gold',
    description: 'Merged 10 pull requests',
    xp: 20,
    rarity: 'epic'
  },
  issue_hunter: {
    name: 'Issue Hunter',
    emoji: '🎯',
    color: 'red',
    description: 'Closed 25 issues',
    xp: 25,
    rarity: 'epic'
  },
  community_champion: {
    name: 'Community Champion',
    emoji: '👑',
    color: 'purple',
    description: 'Participated in 5 events',
    xp: 30,
    rarity: 'legendary'
  },
  streak_warrior: {
    name: 'Streak Warrior',
    emoji: '🔥',
    color: 'orange',
    description: 'Contributed for 30 consecutive days',
    xp: 25,
    rarity: 'epic'
  }
};

const LEVEL_SYSTEM = {
  1: { title: "Explorer", minXP: 0, color: "gray", icon: "🌱" },
  2: { title: "Contributor", minXP: 10, color: "blue", icon: "👨‍💻" },
  3: { title: "Collaborator", minXP: 25, color: "green", icon: "🤝" },
  4: { title: "Maintainer", minXP: 50, color: "purple", icon: "🔧" },
  5: { title: "Architect", minXP: 100, color: "yellow", icon: "🏗️" },
  6: { title: "Legend", minXP: 200, color: "red", icon: "⚡" }
};

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '').replace('-', '_');
    parsed[key] = args[i + 1];
  }
  
  return parsed;
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function loadContributorData(username) {
  const badgesDir = 'community/badges';
  ensureDirectoryExists(badgesDir);
  
  const filePath = path.join(badgesDir, `${username}.json`);
  
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    // Ensure new fields exist
    return {
      ...data,
      xp: data.xp || calculateXP(data.badges || []),
      level: data.level || calculateLevel(data.xp || 0),
      streak: data.streak || 1,
      lastContribution: data.lastContribution || new Date().toISOString().split('T')[0],
      specialties: data.specialties || []
    };
  }
  
  return {
    username,
    badges: [],
    totalContributions: 0,
    joinDate: new Date().toISOString().split('T')[0],
    xp: 0,
    level: 1,
    streak: 1,
    lastContribution: new Date().toISOString().split('T')[0],
    specialties: []
  };
}

function calculateXP(badges) {
  return badges.reduce((total, badge) => {
    const config = BADGE_CONFIGS[badge.type];
    return total + (config ? config.xp : 1);
  }, 0);
}

function calculateLevel(xp) {
  const levels = Object.entries(LEVEL_SYSTEM).reverse();
  for (const [level, config] of levels) {
    if (xp >= config.minXP) {
      return parseInt(level);
    }
  }
  return 1;
}

function updateStreak(contributorData) {
  const today = new Date().toISOString().split('T')[0];
  const lastContrib = new Date(contributorData.lastContribution);
  const todayDate = new Date(today);
  const daysDiff = Math.floor((todayDate - lastContrib) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    // Consecutive day
    contributorData.streak += 1;
  } else if (daysDiff > 1) {
    // Streak broken
    contributorData.streak = 1;
  }
  // If daysDiff === 0, same day contribution, keep streak
  
  contributorData.lastContribution = today;
  return contributorData;
}

function checkMilestoneBadges(contributorData) {
  const newBadges = [];
  
  // PR Master - 10 merged PRs
  const prCount = contributorData.badges.filter(b => b.type === 'first_pr').length;
  if (prCount >= 10 && !contributorData.badges.find(b => b.type === 'pr_master')) {
    newBadges.push({
      type: 'pr_master',
      awardedAt: new Date().toISOString(),
      evidence: { milestone: '10_prs' }
    });
  }
  
  // Issue Hunter - 25 closed issues
  const issueCount = contributorData.badges.filter(b => b.type === 'issue_resolver').length;
  if (issueCount >= 25 && !contributorData.badges.find(b => b.type === 'issue_hunter')) {
    newBadges.push({
      type: 'issue_hunter',
      awardedAt: new Date().toISOString(),
      evidence: { milestone: '25_issues' }
    });
  }
  
  // Community Champion - 5 events
  const eventCount = contributorData.badges.filter(b => b.type === 'event_participation').length;
  if (eventCount >= 5 && !contributorData.badges.find(b => b.type === 'community_champion')) {
    newBadges.push({
      type: 'community_champion',
      awardedAt: new Date().toISOString(),
      evidence: { milestone: '5_events' }
    });
  }
  
  // Streak Warrior - 30 day streak
  if (contributorData.streak >= 30 && !contributorData.badges.find(b => b.type === 'streak_warrior')) {
    newBadges.push({
      type: 'streak_warrior',
      awardedAt: new Date().toISOString(),
      evidence: { milestone: '30_day_streak' }
    });
  }
  
  return newBadges;
}

function saveContributorData(username, data) {
  const badgesDir = 'community/badges';
  ensureDirectoryExists(badgesDir);
  
  const filePath = path.join(badgesDir, `${username}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function generateShieldsBadgeUrl(badgeType, username) {
  const config = BADGE_CONFIGS[badgeType];
  const label = encodeURIComponent(config.name);
  const message = encodeURIComponent(config.emoji);
  
  return `https://img.shields.io/badge/${label}-${message}-${config.color}`;
}

function generateCustomBadgeMarkdown(badgeType, username, evidence) {
  const config = BADGE_CONFIGS[badgeType];
  const badgeUrl = generateShieldsBadgeUrl(badgeType, username);
  
  let linkUrl = `https://github.com/func-Kode/site`;
  if (evidence?.pr_number) {
    linkUrl += `/pull/${evidence.pr_number}`;
  } else if (evidence?.issue_number) {
    linkUrl += `/issues/${evidence.issue_number}`;
  }
  
  return `[![${config.name}](${badgeUrl})](${linkUrl} "${config.description}")`;
}

function updateContributorsFile(username, badgeMarkdown) {
  const contributorsFile = 'CONTRIBUTORS.md';
  
  let content = '';
  if (fs.existsSync(contributorsFile)) {
    content = fs.readFileSync(contributorsFile, 'utf8');
  } else {
    content = `# Contributors 🎉

Thank you to all the amazing contributors who have helped make func(Kode) awesome!

## Community Badges

| User | Badges |
|------|--------|
`;
  }
  
  // Check if user already has an entry
  const userPattern = new RegExp(`\\| @${username}\\s*\\|([^\\n]*)\\|`, 'g');
  const match = userPattern.exec(content);
  
  if (match) {
    // Update existing entry
    const currentBadges = match[1].trim();
    const newBadges = currentBadges ? `${currentBadges} ${badgeMarkdown}` : badgeMarkdown;
    content = content.replace(match[0], `| @${username} | ${newBadges} |`);
  } else {
    // Add new entry
    const tableEnd = content.lastIndexOf('|');
    if (tableEnd !== -1) {
      const insertPoint = content.indexOf('\n', tableEnd) + 1;
      const newRow = `| @${username} | ${badgeMarkdown} |\n`;
      content = content.slice(0, insertPoint) + newRow + content.slice(insertPoint);
    } else {
      // If no table exists, add one
      content += `| @${username} | ${badgeMarkdown} |\n`;
    }
  }
  
  fs.writeFileSync(contributorsFile, content);
}

function awardBadge(badgeType, username, evidence = {}) {
  console.log(`Awarding ${badgeType} badge to @${username}`);
  
  // Load contributor data
  let contributorData = loadContributorData(username);
  
  // Check if badge already exists
  const existingBadge = contributorData.badges.find(b => b.type === badgeType);
  if (existingBadge && badgeType !== 'code_reviewer' && badgeType !== 'issue_resolver') {
    console.log(`Badge ${badgeType} already awarded to @${username}`);
    return;
  }
  
  // Update streak
  contributorData = updateStreak(contributorData);
  
  // Add new badge
  const newBadge = {
    type: badgeType,
    awardedAt: new Date().toISOString(),
    evidence
  };
  
  contributorData.badges.push(newBadge);
  contributorData.totalContributions += 1;
  
  // Recalculate XP and level
  contributorData.xp = calculateXP(contributorData.badges);
  const newLevel = calculateLevel(contributorData.xp);
  const leveledUp = newLevel > contributorData.level;
  contributorData.level = newLevel;
  
  // Check for milestone badges
  const milestoneBadges = checkMilestoneBadges(contributorData);
  contributorData.badges.push(...milestoneBadges);
  
  // Recalculate XP again if milestone badges were added
  if (milestoneBadges.length > 0) {
    contributorData.xp = calculateXP(contributorData.badges);
    contributorData.level = calculateLevel(contributorData.xp);
  }
  
  // Save contributor data
  saveContributorData(username, contributorData);
  
  // Generate badge markdown
  const badgeMarkdown = generateCustomBadgeMarkdown(badgeType, username, evidence);
  
  // Update contributors file
  updateContributorsFile(username, badgeMarkdown);
  
  console.log(`✅ Successfully awarded ${badgeType} badge to @${username}`);
  console.log(`📊 Stats: Level ${contributorData.level}, ${contributorData.xp} XP, ${contributorData.streak} day streak`);
  
  if (leveledUp) {
    const levelConfig = LEVEL_SYSTEM[contributorData.level];
    console.log(`🎉 Level up! @${username} is now a ${levelConfig.title}!`);
  }
  
  if (milestoneBadges.length > 0) {
    console.log(`🏆 Milestone badges awarded: ${milestoneBadges.map(b => b.type).join(', ')}`);
  }
}

// Main execution
const args = parseArgs();
const { badge_type, username, pr_number, issue_number } = args;

if (!badge_type || !username) {
  console.error('Missing required arguments: badge-type and username');
  process.exit(1);
}

const evidence = {};
if (pr_number) evidence.pr_number = pr_number;
if (issue_number) evidence.issue_number = issue_number;

awardBadge(badge_type, username, evidence);