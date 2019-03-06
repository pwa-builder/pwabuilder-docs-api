module.exports = {
    port: process.env.PORT || 3000,
    repositoryIndexPath: process.env.REPOSITORYINDEXPATH || "./github-filefetcher/snippets.json",
    snippetsURL: process.env.SNIPPETSURL || "snippets.json?ref=add/snippits-index",
    baseGitHubUrl: process.env.BASEGITHUBURL || "https://api.github.com/repos",
    ownerGitHubUrl:  process.env.OWNERGITHUBURL || "southworkscom",
    repoGitHubUrl: process.env.REPOGITHUBURL || "pwabuilder-snippits",
    endpointGithubUrl: process.env.ENDPOINTGITHUBURL || "contents"
}
      