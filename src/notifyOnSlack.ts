import { info } from '@actions/core';
import { context } from '@actions/github';
import axios from 'axios';
import { colors } from './const';
import getVariables from './getVariables';

export default async function notifyOnSlack(releaseNote: string) {
  const { slackWebhookUrl, version } = getVariables();

  if (!slackWebhookUrl) {
    info(`${colors.yellow}No slack webhook url provided`);
    return;
  }

  info(`${colors.white}⏳ Notifying release note on Slack...`);

  await axios.post(slackWebhookUrl, { releaseNote, projectName: context.repo.repo, version });

  info(`${colors.green}✅ Notified on Slack successfully!`);
}
