#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const LEVEL_SYSTEM = {
  1: { title: "Explorer", icon: "🌱" },
  2: { title: "Contributor", icon: "👨‍💻" },
  3: { title: "Collaborator", icon: "🤝" },
  4: { title: "Maintainer", icon: "🔧" },
  5: { title: "Architect", icon: "🏗️" },
  6: { title: "Legend", icon: "⚡" }
};

const BADGE_CONFIGS = {
  first_pr: { name: 'First PR', emoji: '👍', celebration: '🎉' },
  issue_resolver: { name: 'Issue Resolver', emoji: '🔧', celebration: '💪' },
  code_reviewer: { name: 'Code Reviewer', emoji: '👀', celebration: '🔍' },
  event_participation: { name: 'Event Participant', emoji: '🎉', celebration: '🚀' },
  project_submission: { name: 'Project Submitter', emoji: '🚀', celebration: '✨' },
  top_contributor: { name: 'Top Contributor', emoji: '⭐', celebration: '🏆' },
  pr_master: { name: 'PR Master', emoji: '🏆', celebration: '🔥' },
  issue_hunter: { name: 'Issue Hunter', emoji: '🎯', celebration: '💯' },
  community_champion: { name: 'Community Champion', emoji: '👑', celebration: '🌟' },
  streak_warrior: { name: 'Streak Warrior', emoji: '🔥', celebration: '⚡' }
};

function getRecentBadges(hoursBack = 24) {
  const badgesDir = 'community/badges';
  if (!fs.existsSync(badgesDir)) return [];

  const cutoffTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
  const recentBadges = [];

  const files = fs.readdirSync(badgesDir).filter(file => file.endsWith('.json'));
  
  for (const file of files) {
    try {
      const filePath = path.join(badgesDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      data.badges.forEach(badge => {
        const awardedAt = new Date(badge.awardedAt);
        if (awardedAt > cutoffTime) {
          recentBadges.push({
            ...badge,
            username: data.username,
            userLevel: data.level || 1,
            userXP: data.xp || 0
          });
        }
      });
    } catch (error) {
      console.error(`Error reading ${file}:`, error);
    }
  }

  return recentBadges.sort((a, b) => new Date(b.awardedAt) - new Date(a.awardedAt));
}

function generateDiscordMessage(badge) {
  const config = BADGE_CONFIGS[badge.type];
  const levelConfig = LEVEL_SYSTEM[badge.userLevel];
  
  let message = `${config.celebration} **Achievement Unlocked!** ${config.celebration}\n\n`;
  message += `**@${badge.username}** just earned the **${config.name}** badge! ${config.emoji}\n`;
  message += `${levelConfig.icon} Level ${badge.userLevel} ${levelConfig.title} • ${badge.userXP} XP\n\n`;
  
  if (badge.evidence?.pr_number) {
    message += `🔗 [View PR #${badge.evidence.pr_number}](https://github.com/func-Kode/site/pull/${badge.evidence.pr_number})\n`;
  } else if (badge.evidence?.issue_number) {
    message += `🔗 [View Issue #${badge.evidence.issue_number}](https://github.com/func-Kode/site/issues/${badge.evidence.issue_number})\n`;
  } else if (badge.evidence?.event_name) {
    message += `🎪 Event: ${badge.evidence.event_name}\n`;
  }
  
  message += `\n🚀 [Join the community](https://github.com/func-Kode/site) and start earning badges!`;
  
  return message;
}



async function sendDiscordWebhook(message) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log('Discord webhook URL not configured');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: message,
        username: 'func(Kode) Bot',
        avatar_url: 'https://github.com/func-Kode.png'
      }),
    });

    if (response.ok) {
      console.log('✅ Discord message sent successfully');
    } else {
      console.error('❌ Failed to send Discord message:', response.statusText);
    }
  } catch (error) {
    console.error('❌ Error sending Discord message:', error);
  }
}



function generateWeeklySummary() {
  const recentBadges = getRecentBadges(24 * 7); // Last 7 days
  
  if (recentBadges.length === 0) return null;
  
  const badgesByUser = {};
  recentBadges.forEach(badge => {
    if (!badgesByUser[badge.username]) {
      badgesByUser[badge.username] = [];
    }
    badgesByUser[badge.username].push(badge);
  });
  
  const topUsers = Object.entries(badgesByUser)
    .sort(([,a], [,b]) => b.length - a.length)
    .slice(0, 3);
  
  let summary = `📊 **Weekly func(Kode) Summary** 📊\n\n`;
  summary += `🏆 ${recentBadges.length} badges awarded this week!\n\n`;
  summary += `**Top Contributors:**\n`;
  
  topUsers.forEach(([username, badges], index) => {
    const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
    summary += `${emoji} @${username} - ${badges.length} badges\n`;
  });
  
  summary += `\n🚀 Join us at https://github.com/func-Kode/site`;
  
  return summary;
}

async function main() {
  console.log('🔍 Checking for recent badge awards...');
  
  const recentBadges = getRecentBadges(1); // Last 1 hour for real-time announcements
  
  if (recentBadges.length === 0) {
    console.log('No recent badges to announce');
    
    // Check if it's time for weekly summary (run on Sundays)
    const now = new Date();
    if (now.getDay() === 0 && now.getHours() === 9) { // Sunday 9 AM
      const weeklySummary = generateWeeklySummary();
      if (weeklySummary) {
        await sendDiscordWebhook(weeklySummary);
      }
    }
    
    return;
  }
  
  console.log(`📢 Announcing ${recentBadges.length} recent badge(s)...`);
  
  for (const badge of recentBadges) {
    const discordMessage = generateDiscordMessage(badge);
    
    await sendDiscordWebhook(discordMessage);
    
    // Add delay between announcements to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('✅ Social announcements completed');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateDiscordMessage, getRecentBadges };