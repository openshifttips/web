module.exports = {
  pathPrefix: "/",
  siteMetadata: {
    title: 'Openshift Compendium',
    description: `Openshift Compendium`,
    author: 'Alex Kretzschmar',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-code-notes',
      options: {
        contentPath: 'notes',
        basePath: '/',
        showThemeInfo: false,
        gitRepoContentPath: 'https://github.com/IronicBadger/openshift-compendium/notes/',
        showDescriptionInSidebar: true,
      },
    },
  ],
}
