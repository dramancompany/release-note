import { info } from '@actions/core';
import { Version3Client } from 'jira.js';
import { Issue } from 'jira.js/out/version3/models';
import { colors } from './const';
import getVariables from './getVariables';

export default async function mapIssuesByComponent(jiraClient: Version3Client) {
  const { issueKeys } = getVariables();

  if (!issueKeys.length) {
    info(`${colors.yellow}No issues to create release note`);
    return null;
  }

  info(`${colors.white}⏳ Mapping issues by components...`);

  const issuesMap: Record<string, Record<string, Issue[]>> = {};

  await Promise.all(
    issueKeys.map(async (issueKey) => {
      try {
        const issue = await jiraClient.issues.getIssue({
          issueIdOrKey: issueKey,
        });
        const components = issue?.fields?.components ?? [];
        const issueType = issue?.fields?.issuetype?.name ?? 'ETC';
        components.forEach(({ name }) => {
          if (!name) {
            return;
          }
          if (!issuesMap[name]) {
            issuesMap[name] = {};
          }
          if (!issuesMap[name][issueType]) {
            issuesMap[name][issueType] = [];
          }
          issuesMap[name][issueType].push(issue);
        });
      } catch {
        // NOTE: 에러는 의도적으로 무시함
      }
    }),
  );

  return issuesMap;
}
