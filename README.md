# Create Github release and notify on Slack

- This action creates Github release and notify on Slack when webhook url is provided

## Inputs

| Name              | Required | Description                                                   | Default |
| ----------------- | -------- | ------------------------------------------------------------- | ------- |
| `githubToken`     | ✅       | Github Token that has right to access repository              | -       |
| `host`            | ✅       | JIRA host address (ex. 'https://dramancompany.atlassian.net') | -       |
| `email`           | ✅       | JIRA email (ex. 'abc@dramancompany.atlassian.net')            | -       |
| `apiToken`        | ✅       | JIRA api token                                                | -       |
| `issueKeys`       | ✅       | JIRA issue keys to update (ex. 'ABC-1,ABC-2')                 | -       |
| `version`         | ✅       | release version (ex. '1.0.0')                                 | -       |
| `slackWebhookUrl` | ❌       | Slack webhook url to send release note                        | -       |

## Outputs

N/A

## Example Usage

```yaml
on:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  if: ${{ github.event.pull_request.merged }}
  runs-on: ubuntu-latest
  steps:
    - name: Get new version
      id: get-new-version

    - name: Extract JIRA issue keys
      id: jira-issue-keys
      uses: dramancompany/extract-jira-issue-keys@v1.0.0
      with:
        githubToken: ${{ secrets.GITHUB_TOKEN }}

    - name: Update JIRA issues and release project version
      uses: dramancompany/jira-release@v1.0.0
      with:
        host: ${{ secrets.JIRA_HOST }}
        email: ${{ secrets.JIRA_EMAIL }}
        apiToken: ${{ secrets.JIRA_API_TOKEN }}
        issueKeys: ${{ steps.jira-issue-keys.outputs.issueKeys }}
        projectKey: 'PCWEB'
        versionPrefix: 'career-v'
        version: ${{ steps.get-new-version.outputs.version }}
        componentName: 'career-web'

    - name: Create Github release and notify on Slack
      uses: dramancompany/release-note
      with:
        githubToken: ${{ secrets.GITHUB_TOKEN }}
        host: ${{ secrets.JIRA_HOST }}
        email: ${{ secrets.JIRA_EMAIL }}
        apiToken: ${{ secrets.JIRA_API_TOKEN }}
        issueKeys: ${{ steps.jira-issue-keys.outputs.issueKeys }}
        version: ${{ steps.get-new-version.outputs.version }}
        slackWebhookUrl: ${{ secrets.RELEASE_NOTE_SLACK_WEBHOOK_URL }}
```
