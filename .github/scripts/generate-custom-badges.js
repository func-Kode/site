#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Custom SVG badge templates
const SVG_TEMPLATES = {
  event_participation: (username, eventName) => `
<svg width="200" height="35" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="eventGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FF6B35;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#F7931E;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="200" height="35" rx="5" fill="url(#eventGrad)"/>
  <text x="10" y="22" font-family="Arial, sans-serif" font-size="12" fill="white" font-weight="bold">
    🎉 Event Participant
  </text>
  <text x="10" y="32" font-family="Arial, sans-serif" font-size="8" fill="white" opacity="0.9">
    ${eventName || 'Community Event'}
  </text>
</svg>`,

  project_submission: (username, projectName) => `
<svg width="180" height="35" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="projectGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="180" height="35" rx="5" fill="url(#projectGrad)"/>
  <text x="10" y="22" font-family="Arial, sans-serif" font-size="12" fill="white" font-weight="bold">
    🚀 Project Submitter
  </text>
  <text x="10" y="32" font-family="Arial, sans-serif" font-size="8" fill="white" opacity="0.9">
    ${projectName || 'Awesome Project'}
  </text>
</svg>`,

  top_contributor: (username, month) => `
<svg width="160" height="35" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="topGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FFA500;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="160" height="35" rx="5" fill="url(#topGrad)"/>
  <text x="10" y="22" font-family="Arial, sans-serif" font-size="12" fill="white" font-weight="bold">
    ⭐ Top Contributor
  </text>
  <text x="10" y="32" font-family="Arial, sans-serif" font-size="8" fill="white" opacity="0.9">
    ${month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
  </text>
</svg>`,

  first_pr: (username) => `
<svg width="120" height="35" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="firstPRGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#28a745;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#20c997;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="120" height="35" rx="5" fill="url(#firstPRGrad)"/>
  <text x="10" y="15" font-family="Arial, sans-serif" font-size="12" fill="white" font-weight="bold">
    👍 First PR
  </text>
  <text x="10" y="28" font-family="Arial, sans-serif" font-size="8" fill="white" opacity="0.9">
    Welcome!
  </text>
</svg>`
};

function generateCustomBadge(badgeType, username, metadata = {}) {
  const template = SVG_TEMPLATES[badgeType];
  if (!template) {
    console.error(`No template found for badge type: ${badgeType}`);
    return null;
  }

  return template(username, metadata.eventName || metadata.projectName || metadata.month);
}

function saveBadgeToFile(badgeType, username, svgContent) {
  const badgesDir = 'community/custom-badges';
  if (!fs.existsSync(badgesDir)) {
    fs.mkdirSync(badgesDir, { recursive: true });
  }

  const filename = `${username}-${badgeType}.svg`;
  const filepath = path.join(badgesDir, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`✅ Custom badge saved: ${filepath}`);
  
  return filepath;
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node generate-custom-badges.js <badge-type> <username> [metadata]');
    process.exit(1);
  }

  const [badgeType, username, ...metadataArgs] = args;
  const metadata = {};
  
  // Parse metadata arguments
  for (let i = 0; i < metadataArgs.length; i += 2) {
    if (metadataArgs[i] && metadataArgs[i + 1]) {
      const key = metadataArgs[i].replace('--', '');
      metadata[key] = metadataArgs[i + 1];
    }
  }

  const svgContent = generateCustomBadge(badgeType, username, metadata);
  if (svgContent) {
    saveBadgeToFile(badgeType, username, svgContent);
  }
}

module.exports = { generateCustomBadge, saveBadgeToFile };