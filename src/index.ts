import { error, setFailed } from '@actions/core';
import { colors } from './const';
import createReleaseNote from './createReleaseNote';
import githubRelease from './githubRelease';
import initJiraClient from './initJiraClient';
import mapIssuesByComponent from './mapIssuesByComponent';
import notifyOnSlack from './notifyOnSlack';

(async () => {
  try {
    const jiraClient = initJiraClient();
    const issuesMap = await mapIssuesByComponent(jiraClient);
    const releaseNote = await createReleaseNote(issuesMap);
    await Promise.all([githubRelease(releaseNote), notifyOnSlack(releaseNote)]);
  } catch (e: any) {
    error(`${colors.red}${e?.message}`);
    setFailed(e?.message);
  }
})();
