#!/usr/bin/env node

const { Octokit } = require('@octokit/rest');
const fs = require('fs');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function getContributionsLastMonth() {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const since = lastMonth.toISOString();
  const until = thisMonth.toISOString();
  
  console.log(`Calculating contributions from ${since} to ${until}`);
  
  const contributions = {};
  
  try {
    // Get merged PRs
    const { data: prs } = await octokit.rest.pulls.list({
      owner: 'func-Kode',
      repo: 'site',
      state: 'closed',
      sort: 'updated',
      direction: 'desc',
      per_page: 100
    });
    
    for (const pr of prs) {
      if (pr.merged_at && 
          new Date(pr.merged_at) >= lastMonth && 
          new Date(pr.merged_at) < thisMonth) {
        const user = pr.user.login;
        contributions[user] = (contributions[user] || 0) + 3; // PRs worth 3 points
        console.log(`PR #${pr.number} by @${user}: +3 points`);
      }
    }
    
    // Get closed issues
    const { data: issues } = await octokit.rest.issues.list({
      owner: 'func-Kode',
      repo: 'site',
      state: 'closed',
      sort: 'updated',
      direction: 'desc',
      per_page: 100,
      since
    });
    
    for (const issue of issues) {
      if (!issue.pull_request && 
          issue.closed_at && 
          new Date(issue.closed_at) >= lastMonth && 
          new Date(issue.closed_at) < thisMonth) {
        const user = issue.user.login;
        contributions[user] = (contributions[user] || 0) + 1; // Issues worth 1 point
        console.log(`Issue #${issue.number} by @${user}: +1 point`);
      }
    }
    
    // Get PR reviews
    for (const pr of prs) {
      if (pr.merged_at && 
          new Date(pr.merged_at) >= lastMonth && 
          new Date(pr.merged_at) < thisMonth) {
        try {
          const { data: reviews } = await octokit.rest.pulls.listReviews({
            owner: 'func-Kode',
            repo: 'site',
            pull_number: pr.number
          });
          
          for (const review of reviews) {
            if (review.submitted_at && 
                new Date(review.submitted_at) >= lastMonth && 
                new Date(review.submitted_at) < thisMonth) {
              const user = review.user.login;
              if (user !== pr.user.login) { // Don't count self-reviews
                contributions[user] = (contributions[user] || 0) + 2; // Reviews worth 2 points
                console.log(`Review on PR #${pr.number} by @${user}: +2 points`);
              }
            }
          }
        } catch (error) {
          console.log(`Could not fetch reviews for PR #${pr.number}`);
        }
      }
    }
    
  } catch (error) {
    console.error('Error fetching contributions:', error);
    return null;
  }
  
  return contributions;
}

async function main() {
  const contributions = await getContributionsLastMonth();
  
  if (!contributions || Object.keys(contributions).length === 0) {
    console.log('No contributions found for last month');
    console.log('::set-output name=username::');
    return;
  }
  
  // Find top contributor
  const sortedContributors = Object.entries(contributions)
    .sort(([,a], [,b]) => b - a);
  
  console.log('\\nTop contributors last month:');
  sortedContributors.forEach(([user, points], index) => {
    console.log(`${index + 1}. @${user}: ${points} points`);
  });
  
  const [topContributor, topPoints] = sortedContributors[0];
  
  // Check if they already have a top contributor badge for this month
  const badgesDir = 'community/badges';
  const contributorFile = `${badgesDir}/${topContributor}.json`;
  
  let shouldAward = true;
  if (fs.existsSync(contributorFile)) {
    const data = JSON.parse(fs.readFileSync(contributorFile, 'utf8'));
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    
    const hasCurrentMonthBadge = data.badges.some(badge => 
      badge.type === 'top_contributor' && 
      badge.awardedAt.startsWith(currentMonth)
    );
    
    if (hasCurrentMonthBadge) {
      console.log(`@${topContributor} already has top contributor badge for this month`);
      shouldAward = false;
    }
  }
  
  if (shouldAward && topPoints >= 3) { // Minimum 3 points to be top contributor
    console.log(`\\n🏆 Top contributor: @${topContributor} with ${topPoints} points`);
    console.log(`::set-output name=username::${topContributor}`);
    console.log(`::set-output name=points::${topPoints}`);
  } else {
    console.log('\\nNo eligible top contributor this month');
    console.log('::set-output name=username::');
  }
}

main().catch(console.error);