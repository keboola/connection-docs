---
title: GitHub
slug: 'components/extractors/other/github'
redirect_from:
    - /extractors/other/github/
---



The GitHub data source connector uses the [GitHub API](https://developer.github.com/v3/) to import data from [GitHub](https://github.com/)
to Keboola.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **GitHub** connector.

### Authentication
In the authorization section, enter a **GitHub Personal Access Token (PAT)** with the required scopes: `read:org` and `repo`.
You can create a PAT in [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens).

### Endpoints
Select one or more **Endpoints to Extract**:

- `organizations` -- your GitHub organizations
- `organization_members` -- members of your organizations
- `organization_teams` -- teams within your organizations
- `organization_repositories` -- repositories owned by your organizations
- `repository_issues` -- issues in a repository
- `repository_commits` -- commits in a repository

### Row Configuration
Click **Add Row** to add one or more [configuration rows](/components/#configuration-rows).
Each row specifies the scope of extraction:

- **Organization Name** -- GitHub organization name (required for organization-related endpoints).
- **Repository Owner** -- repository owner username or organization name (required for repository-specific endpoints).
- **Repository Name** -- repository name (required for repository-specific endpoints).
- **Issue State** -- filter issues by state: `all` (default), `open`, or `closed` (for the `repository_issues` endpoint).
- **Commits Since** -- only fetch commits after this date in ISO 8601 format (e.g., `2024-01-01T00:00:00Z`). Leave empty for all commits (for the `repository_commits` endpoint).

Remember to **save** the configuration.
