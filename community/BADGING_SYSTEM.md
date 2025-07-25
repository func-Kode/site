# func(Kode) Community Badging System 🏅

An automated system to recognize and celebrate community contributions through digital badges.

## Overview

Our badging system automatically detects contributions and awards badges to community members. Badges are displayed in the `CONTRIBUTORS.md` file and can be copied to personal GitHub profiles.

## Available Badges

### 👍 First PR
- **Trigger**: First merged pull request
- **Points**: 3
- **Auto-awarded**: Yes

### 🔧 Issue Resolver  
- **Trigger**: Closing an issue
- **Points**: 1
- **Auto-awarded**: Yes

### 👀 Code Reviewer
- **Trigger**: Reviewing a pull request
- **Points**: 2
- **Auto-awarded**: Yes

### 🎉 Event Participant
- **Trigger**: Participating in community events
- **Points**: 5
- **Auto-awarded**: Manual (via workflow dispatch)

### 🚀 Project Submitter
- **Trigger**: Submitting a project to showcase
- **Points**: 5
- **Auto-awarded**: Manual (via workflow dispatch)

### ⭐ Top Contributor
- **Trigger**: Highest points in a month (minimum 3 points)
- **Points**: 10
- **Auto-awarded**: Monthly (1st of each month)

## How It Works

### Automatic Detection

1. **Pull Request Merged**: Awards "First PR" badge for first-time contributors
2. **Issue Closed**: Awards "Issue Resolver" badge
3. **PR Review Submitted**: Awards "Code Reviewer" badge
4. **Monthly Calculation**: Calculates top contributor based on points

### Manual Awards

Use the "Manual Badge Award" workflow for:
- Event participation
- Project submissions
- Special recognitions

### Badge Storage

- **Contributor Data**: `community/badges/{username}.json`
- **Custom SVGs**: `community/custom-badges/{username}-{badge-type}.svg`
- **Display**: `CONTRIBUTORS.md`

## Usage

### For Contributors

1. **Earn Badges**: Contribute to the repository through PRs, issues, reviews, and events
2. **View Badges**: Check `CONTRIBUTORS.md` for your awarded badges
3. **Copy Markdown**: Use the provided markdown to add badges to your GitHub profile

### For Maintainers

#### Manual Badge Award

1. Go to Actions → "Manual Badge Award"
2. Click "Run workflow"
3. Select badge type and enter username
4. Add optional metadata (event name, project URL)

#### Monthly Top Contributor

- Runs automatically on the 1st of each month
- Can be triggered manually via workflow dispatch
- Calculates based on contribution points from previous month

## Badge Integration

### GitHub Profile README

```markdown
## My func(Kode) Badges
[![First PR](https://img.shields.io/badge/First%20PR-👍-green)](https://github.com/func-Kode/site)
[![Event Participant](https://img.shields.io/badge/Event%20Participant-🎉-orange)](https://github.com/func-Kode/site)
```

### Website Integration

The badge dashboard component (`components/badge-dashboard.tsx`) provides:
- Real-time badge statistics
- Contributor profiles with badges
- Copy-to-clipboard functionality
- Badge usage instructions

## Technical Implementation

### GitHub Actions Workflows

1. **`award-badges.yml`**: Main workflow for automatic badge detection
2. **`manual-badge-award.yml`**: Manual badge awarding interface
3. **`monthly-top-contributor.yml`**: Monthly top contributor calculation

### Scripts

1. **`award-badge.js`**: Core badge awarding logic
2. **`generate-custom-badges.js`**: Custom SVG badge generation
3. **`calculate-top-contributor.js`**: Monthly contribution calculation

### Badge URLs

- **Shields.io**: `https://img.shields.io/badge/{label}-{emoji}-{color}`
- **Custom SVGs**: `community/custom-badges/{username}-{badge-type}.svg`

## Customization

### Adding New Badge Types

1. Update `BADGE_CONFIGS` in `award-badge.js`
2. Add SVG template in `generate-custom-badges.js`
3. Update workflow triggers if needed
4. Update documentation

### Custom Badge Design

- Modify SVG templates in `generate-custom-badges.js`
- Use brand colors and fonts
- Include event/project specific information

## API Integration

### Open Badges (Future)

```javascript
// Example integration with Badgr API
const awardOpenBadge = async (username, badgeType) => {
  const response = await fetch('https://api.badgr.io/v2/badgeclasses/{badge-id}/assertions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.BADGR_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipient: {
        identity: `${username}@github.com`,
        type: 'email'
      },
      evidence: [{
        url: `https://github.com/func-Kode/site/pulls?q=author:${username}`,
        narrative: `GitHub contributions by ${username}`
      }]
    })
  });
};
```

## Monitoring and Analytics

### Badge Statistics

- Total badges awarded
- Most popular badge types
- Monthly badge trends
- Top badge earners

### Contribution Tracking

- Points-based system
- Monthly leaderboards
- Contribution streaks
- Community growth metrics

## Best Practices

### For Contributors

- Engage regularly with the community
- Participate in events and discussions
- Help review others' contributions
- Share your badges on social media

### For Maintainers

- Recognize contributions promptly
- Celebrate badge achievements
- Use badges to encourage participation
- Keep badge criteria fair and achievable

## Troubleshooting

### Common Issues

1. **Badge not awarded**: Check workflow logs in Actions tab
2. **Duplicate badges**: System prevents duplicates (except reviewer/resolver)
3. **Missing contributor data**: Check `community/badges/` directory

### Manual Fixes

```bash
# Re-run badge award for specific user
node .github/scripts/award-badge.js --badge-type first_pr --username username

# Generate custom badge
node .github/scripts/generate-custom-badges.js event_participation username --eventName "Sprint #1"
```

## Future Enhancements

- [ ] Integration with Open Badges standard
- [ ] LinkedIn badge sharing
- [ ] Badge verification system
- [ ] Community voting for special badges
- [ ] Streak tracking and rewards
- [ ] Badge rarity and special editions

---

*This badging system is designed to celebrate and encourage community participation. Join us and start earning your badges today!*