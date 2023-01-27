import { info } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { colors } from './const';
import getVariables from './getVariables';

export default async function githubRelease(releaseNote: string) {
  const { version, githubToken } = getVariables();

  info(`${colors.white}⏳ Creating GitHub release...`);

  const octokit = getOctokit(githubToken);

  await octokit.rest.repos.createRelease({
    owner: context.repo.owner,
    repo: context.repo.repo,
    tag_name: version,
    name: version,
    body: releaseNote,
    draft: false,
    prerelease: false,
  });

  info(`${colors.green}✅ Released ${version} successfully!`);
}
