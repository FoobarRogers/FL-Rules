# Project instructions

## Repository and pull request targets

- The working repository is `FoobarRogers/FL-Rules`.
- `dler-io/Rules` is the upstream source for reference and synchronization.
- By default, create branches, push changes, and open pull requests only in `FoobarRogers/FL-Rules`.
- Pull requests normally target this fork's `main` branch, unless the user specifies another branch in this fork.
- Always specify the repository explicitly when creating a pull request. Do not rely on a tool's inferred repository, because fork tooling may default to the upstream repository.
- Do not open pull requests against `dler-io/Rules` or push to upstream unless the user explicitly requests an upstream contribution.
- Keep the fork relationship intact; setting the working target does not require detaching the fork.

## Local GitHub CLI setup

When using a local checkout of this project, set its directory-scoped default with:

```sh
gh repo set-default FoobarRogers/FL-Rules
```

This CLI setting applies to that local checkout; it does not change GitHub's web interface or other clients. Continue passing an explicit repository when creating pull requests.
