# Branch Naming Quick Reference

## Pattern

```
<type>/<JIRA-TICKET>/<short-description>
```

## Types

- `feature` - New features
- `bugfix` - Bug fixes
- `hotfix` - Critical production fixes
- `release` - Release branches
- `chore` - Maintenance tasks
- `refactor` - Code refactoring
- `docs` - Documentation
- `test` - Testing

## Examples

```bash
# Feature
git checkout -b feature/PROJ-123/user-authentication

# Bug Fix
git checkout -b bugfix/BUG-456/fix-login-error

# Hotfix
git checkout -b hotfix/HOT-789/critical-security-patch

# Documentation
git checkout -b docs/DOC-101/update-readme

# Chore
git checkout -b chore/DEV-202/update-dependencies
```

## Rename Branch

```bash
git branch -m <type>/<JIRA-TICKET>/<description>
git push origin -u <type>/<JIRA-TICKET>/<description>
git push origin --delete <old-branch-name>
```

## Rules

- ✅ Type: lowercase
- ✅ JIRA ticket: UPPERCASE with hyphen (PROJ-123)
- ✅ Description: lowercase, kebab-case (use-hyphens)
- ❌ No spaces, underscores, or special characters

See [BRANCH_NAMING_GUIDE.md](./BRANCH_NAMING_GUIDE.md) for detailed documentation.
