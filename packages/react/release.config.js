module.exports = {
  branches: [
    "master",
    { name: "develop", channel: "beta", prerelease: "beta" },
  ],
  repositoryUrl: "https://github.com/amfa-team/space-service.git",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
      },
    ],
    "@semantic-release/npm",
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md"],
        message:
          // eslint-disable-next-line no-template-curly-in-string
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    "@semantic-release/github",
    [
      "@semantic-release/exec",
      {
        publishCmd: "git checkout -- package.json",
      },
    ],
    [
      "@saithodev/semantic-release-backmerge",
      {
        branchName: "develop",
        plugins: [],
      },
    ],
    [
      "semantic-release-slack-bot",
      {
        notifyOnSuccess: true,
        notifyOnFail: true,
        markdownReleaseNotes: true,
      },
    ],
  ],
};
