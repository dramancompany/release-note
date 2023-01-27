import { getInput } from '@actions/core';

export default function getVariables() {
  const githubToken = getInput('githubToken', { required: true });
  const host = getInput('host', { required: true });
  const email = getInput('email', { required: true });
  const apiToken = getInput('apiToken', { required: true });
  const issueKeys = getInput('issueKeys', { required: true });
  const version = getInput('version', { required: true });
  const slackWebhookUrl = getInput('slackWebhookUrl');

  return {
    githubToken,
    host,
    email,
    apiToken,
    issueKeys: issueKeys.split(','),
    version,
    slackWebhookUrl,
  };
}
