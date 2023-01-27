import { info } from '@actions/core';
import { Issue } from 'jira.js/out/version3/models';
import { colors } from './const';
import getVariables from './getVariables';

export default async function createReleaseNote(
  issuesMap?: Record<string, Record<string, Issue[]>> | null,
) {
  const { version } = getVariables();

  if (!issuesMap) {
    info(`${colors.yellow}No issues to create release note`);
    return 'No related Jira issues';
  }

  info(`${colors.white}⏳ Creating release note...`);

  let releaseNote = `# ${version}\n`;

  Object.entries(issuesMap).map(([componentName, issuesByIssueType]) => {
    releaseNote += `\n*[${componentName}]*\n`;

    Object.entries(issuesByIssueType).map(([issueType, issues]) => {
      releaseNote += `\n*${issueType}*\n`;

      issues.forEach((issue) => {
        releaseNote += `- [${issue.key}] ${issue.fields?.summary}\n`;
      });
    });
  });

  return releaseNote;
}
